const gulp = require("gulp");

function copyNonTS() {
  return gulp.src(["./src/**/*", "!./src/**/*.ts"]).pipe(gulp.dest("./dist"));
}

function watchFiles() {
  // Watch all files in src directory except .ts files for changes
  // Run copyNonTS task when a change is detected
  gulp.watch(["./src/**/*", "!./src/**/*.ts"], copyNonTS);
}

// Default task that runs when you type "gulp" in your terminal
exports.default = watchFiles;
