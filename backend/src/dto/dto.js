function OK(data) {
  return { success: true, data };
}

function Err(message) {
  return { success: false, error: message };
}

module.exports = { OK, Err };