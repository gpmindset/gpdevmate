import { Probot } from "probot";

export default (app: Probot) => {
    app.on("issues.opened", async (context) => {
        const issueComment = context.issue({
            body: "Thanks for opening this issue!",
        });
        await context.octokit.issues.createComment(issueComment);
    });

    app.on("push", async (context) => {
        console.log("New Push", context.payload)
    })
};
