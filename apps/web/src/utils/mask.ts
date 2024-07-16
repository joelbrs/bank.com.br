export const setMaskTaskId = (input: string) => {
  if (input.length === 11) {
    return input.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  if (input.length === 14) {
    return input.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }
  return input;
};

export const setMaskEmail = (input?: string) => {
  return input?.replace(/(.{2})(.*)(?=@)/, function (_, p1, p2) {
    return p1 + "*".repeat(p2.length);
  });
};
