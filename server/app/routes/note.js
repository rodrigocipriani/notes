module.exports = app => {
  const controller = app.controllers.note;

  app.route(`/api/v1/note/list`).get(controller.listNote);
  app.route(`/api/v1/note/save`).post(controller.saveNote);
};
