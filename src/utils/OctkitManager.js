// Helper for creating Octokit instances with repository-specific defaults.
import { Octokit } from 'octokit';

// Construct an Octokit client with optional base URL and auth token.
const OctkitManager = ({ url, auth }) => {
    const param = {};
    param.baseUrl = (!url) ? 'https://api.github.com' : url ;
    if (auth && (auth !== '')) param.auth = auth;

    const octokit = new Octokit(param);

    return octokit;
}

export default OctkitManager;
