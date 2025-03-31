globalThis.app = {
  clickup: {handle: () => 'clickup'},
  telegram: {handle: () => 'telegram'},
};

const router = await import('../app/router.js').then((m) => m.router);

describe('resolve:', () => {
  it('resolve a route to the method that handles it', () => {
    const result = router.resolve('/clickup');
    expect(typeof result).toBe('function');
    expect(result).toEqual(app.clickup.handle);
  });
});
