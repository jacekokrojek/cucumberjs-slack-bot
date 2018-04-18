const _ = require('lodash');
const getRepoInfo = require('git-repo-info');
const fs = require('fs');
const path = require('path');

const parser = require('./parse');

exports.create = function (slackBotOptions) {

  function _defaultIfSet(variable, defaultValue) {
    if (!variable){
      return defaultValue
    }
    return variable;
  }

  function _readTemplateFile(fileName) {
    if (fileName) {
      try {
        fs.accessSync(fileName, fs.constants.R_OK);
        return fs.readFileSync(fileName, 'utf-8');
      } catch (err) {
        return fs.readFileSync(path.join(__dirname, 'templates', fileName), 'utf-8');
      }
    } else {
      return "";
    }
  }
  let message = "";
  let githubInfo = slackBotOptions.githubInfo;
  if (githubInfo) {
    const info = getRepoInfo();
    let githubBaseUrl = slackBotOptions.githubAccount;
    let repoName = slackBotOptions.githubRepo;
    let commitHash = info.sha;
    let branch = info.branch;
    let abbrevSha = info.abbreviatedSha;
    let author = _defaultIfSet(info.author, "").split('<')[0];
    let commitLink = "<https://github.com/" + githubBaseUrl + "/" + repoName + "/commit/" + commitHash + "|" + abbrevSha + ">"
    let branchLink = "<https://github.com/" + githubBaseUrl + "/" + repoName + "/tree/" + branch + "|" + branch + ">"
    let message = author + "authored commit " + commitLink + " in branch " + branchLink + ".";
  }

  const parser = require('./parse');
  let badReport = require(slackBotOptions.cucumberJSON);
  let summary = parser.parseRawJSON(badReport);
  summary.title = _defaultIfSet(slackBotOptions.title, "E2E Test Results");
  summary.message = _defaultIfSet(slackBotOptions.message, message);

  let template = _readTemplateFile("default.tmpl");
  let templateFn = _.template(template);
  //execute template function with JSON object for the interpolated values
  let templateJSON = templateFn({
    'summary': summary
  });
  return JSON.parse(templateJSON)
  //return templateJSON;
}