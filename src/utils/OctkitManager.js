import { Octokit } from 'octokit';

const OctkitManager = ({ url, auth }) => {
    const param = {};
    param.baseUrl = (!url) ? 'https://api.github.com' : url ;
    if (auth && (auth !== '')) param.auth = auth;

    const octokit = new Octokit(param);

    return octokit;
}

export default OctkitManager;
