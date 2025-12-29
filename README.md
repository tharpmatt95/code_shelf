When adding a new section:

* Update UserPage.vue to add a new `<el-descriptions-item label="Section Correct">`
* Update router.js to have both a new import and a new route
* Add a new el-menu-item to App.vue
* Add new section to keep = new Set() on seed.js
* Add a new mongoose model to seed.js
* Add a new JSON seed section to seed.js
* Add a new mongoose model to index.js
* Add a new correctSection schema to index.js
* Add a new .populate('correctSection') in app.get('/auth/me') in index.js
* Add a new SECTION QUIZ ROUTES section to index.js
* Write the new SectionQuiz.vue
