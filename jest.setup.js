global.FormData = class FormData {
  append = jest.fn();
  delete = jest.fn();
  get = jest.fn();
  getAll = jest.fn();
  has = jest.fn();
  set = jest.fn();
  forEach = jest.fn();
  entries = jest.fn();
  keys = jest.fn();
  values = jest.fn();
};

global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();