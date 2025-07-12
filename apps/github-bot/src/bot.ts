import { Probot } from "probot";
import {pullRequestHandler} from "./handlers/pull-request";

export default (app: Probot) => {
    /**
     * Pull Request Handler
     * */
    pullRequestHandler(app)
};
