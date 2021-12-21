type MoxxyConfig = Readonly<{
  moxxyDir: string;
}>;

export const moxxyConfig: MoxxyConfig = {
  moxxyDir: process.env.MOXXY_DIR ?? 'moxxy',
};
