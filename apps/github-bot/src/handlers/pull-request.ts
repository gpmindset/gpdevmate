import {Context, Probot} from "probot";
import {PRCodeReviewAgent} from "@gpdevmate/core";

export const pullRequestHandler = (app: Probot) => {

    async function getChangedFiles(context: Context, prNumber: number) {
        const { data: prFiles } = await context.octokit.pulls.listFiles(context.repo({ pull_number: prNumber }))
        return prFiles
            .filter((file) => (file.status === 'modified' || file.status === 'added') && file.patch).map(file => ({
            path: file.filename,
            content: file.raw_url,
            patch: file.patch,
        }))
    }

    async function getLatestCommitFiles(context: Context<"pull_request">) {
        const { owner, repo } = context.repo()
        const headSha = context.payload.pull_request.head.sha

        const { data: commit } = await context.octokit.repos.getCommit({
            owner,
            repo,
            ref: headSha,
        });

        function isWhitespaceOnlyPatch(patch: string): boolean {
            const addedLines: string[] = [];
            const removedLines: string[] = [];

            for (const line of patch.split('\n')) {
                if (line.startsWith('+++') || line.startsWith('---') || line.startsWith('@@')) continue;

                if (line.startsWith('+') && !line.startsWith('+++')) {
                    addedLines.push(line.slice(1));
                } else if (line.startsWith('-') && !line.startsWith('---')) {
                    removedLines.push(line.slice(1));
                }
            }

            if (addedLines.length !== removedLines.length) return false;

            return addedLines.every((added, i) => added.trim() === removedLines[i].trim());
        }

        return commit.files?.filter(file =>
            (file.status === 'added' || file.status === 'modified') &&
            file.patch && !isWhitespaceOnlyPatch(file.patch)
        ).map(file => ({
            path: file.filename,
            patch: file.patch!,
            content: file.raw_url,
        })) ?? [];

    }

    app.on(["pull_request.opened", "pull_request.synchronize"], async (context) => {
        const pr = context.payload.pull_request;
        const repo = context.payload.repository;

        context.log.info(`🔍 Reviewing PR #${pr.number} in ${repo.full_name}`)

        const getPRfiles = await getLatestCommitFiles(context);
        if (!getPRfiles.length) {
            context.log.info("No relevant PR files to review.");
            await context.octokit.issues.createComment({
                owner: context.payload.repository.owner.login,
                repo: context.payload.repository.name,
                issue_number: context.payload.pull_request.number,
                body: "No valid code changes found in the latest commit for review.😃",
            })
            return;
        }

        const prCodeReviewAgent = new PRCodeReviewAgent({
            snippets: getPRfiles,
            maxFiles: parseInt(process.env.MAX_FILES as string) || 5,
        })

        const getFeedback = await prCodeReviewAgent.getReview()

        if (getFeedback) {
            const comment = getFeedback[0].comment;
            await context.octokit.issues.createComment({
                owner: context.payload.repository.owner.login,
                repo: context.payload.repository.name,
                issue_number: context.payload.pull_request.number,
                body: `🧠 **Your GPdevmate's feedback for latest commit**:\n\n${comment}`,
            })
        }

    })
}