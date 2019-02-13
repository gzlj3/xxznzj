exports.getFmMeta = (fmMetas,name) => {
  fmMetas.map(meta => {
    if (meta.name===name) {
      return meta;
    }
  });
  return null;
}
