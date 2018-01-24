exports.parseRawJSON = function (jsonPath) {
  let report = jsonPath
  let summary = {
    feature: {
      grade: 0,
      total: 0,
      passed: 0,
      failed: 0,
      affected: 0,
    },
    scenario: {
      grade: 0,
      total: 0,
      passed: 0,
      skipped: 0,
      failed: 0,
      inconclusive: 0,
    },
    step: {
      grade: 0,
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0
    },
    hook: {
      total: 0,
      passed: 0,
      failed: 0,
    },
  }

  for (let feature of report) {
    let totalBefore = summary.step.total;
    let failuresBefore = summary.step.failed;
    let skipsBefore = summary.step.skipped;
    let passesBefore = summary.step.passed;

    for (let scenario of feature.elements) {
      let totalBefore = summary.step.total;
      let failuresBefore = summary.step.failed;
      let skipsBefore = summary.step.skipped;
      let passesBefore = summary.step.passed;

      for (let step of scenario.steps) {
        if (step.keyword === 'After' || step.keyword === 'Before') {
          summary.hook.total++;
          step.result.status === 'failed' ? summary.hook.failed++ :
            step.result.status === 'passed' ? summary.hook.passed++ :
              console.log(step.result.status);
        } else {
          summary.step.total++;
          // console.log('Feature ' + featureCounter + '/Scenario ' + scenarioCounter + '/Step ' + stepCounter + ': ' + step.result.status);
          step.result.status === 'failed' ? summary.step.failed++ :
            step.result.status === 'passed' ? summary.step.passed++ :
              step.result.status === 'skipped' ? summary.step.skipped++ :
                console.log(step.result.status);
        }
      }

      // Scenario Assignment
      let totalAfter = summary.step.total;
      let failuresAfter = summary.step.failed;
      let skipsAfter = summary.step.skipped;
      let passesAfter = summary.step.passed;

      failuresBefore !== failuresAfter ? summary.scenario.failed++ :
        skipsBefore !== skipsAfter && failuresBefore === failuresAfter ? summary.scenario.skipped++ :
          passesBefore !== passesAfter && failuresBefore === failuresAfter && skipsBefore === skipsAfter ? summary.scenario.passed++ :
            totalAfter = totalAfter; // TODO: Test this; a single step pass does not equal a full scenario pass.

      summary.scenario.total++;
    }

    // Feature Assignment
    let totalAfter = summary.step.total;
    let failuresAfter = summary.step.failed;
    let skipsAfter = summary.step.skipped;
    let passesAfter = summary.step.passed;

    failuresBefore !== failuresAfter ? summary.feature.failed++ :
      skipsBefore !== skipsAfter && failuresBefore === failuresAfter ? summary.feature.affected++ :
        passesAfter === totalAfter - totalBefore ? summary.feature.passed++ :
          totalAfter = totalAfter; // TODO: Test this; a single step pass does not equal a full scenario pass.

    summary.feature.total++;
  } // Next Line is needed to catch Protractor bugs at the step level.
  summary.scenario.inconclusive = summary.scenario.total - summary.scenario.failed - summary.scenario.passed - summary.scenario.skipped;

  // Set Grades
  summary.feature.grade = Math.ceil((summary.feature.passed / summary.feature.total) * 100);
  summary.scenario.grade = Math.ceil((summary.scenario.passed / summary.scenario.total) * 100);
  summary.step.grade = Math.ceil((summary.step.passed / summary.step.total) * 100);

  return summary;
}
