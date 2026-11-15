import assert from 'node:assert/strict';
import test from 'node:test';

const React = {
  createElement: (...args) => ({ type: typeof args[0] === 'string' ? args[0] : 'component', component: typeof args[0] === 'function' ? args[0] : null, props: { ...(args[1] || {}), children: args.slice(2) } }),
  Fragment: 'Fragment',
  memo: (component) => component,
  useState: (value) => [typeof value === 'function' ? value() : value, () => {}],
  useEffect: () => {},
  useCallback: (fn) => fn,
  useMemo: (fn) => fn(),
  useRef: (value) => ({ current: value }),
};

const registrations = [];
const tabTypes = [];
const openedTabs = [];
const openedResources = [];
const addresses = [];
let rightbarOpens = 0;

const guideEntries = [
  { kind: 'terminal', providerId: 'p-term' },
  { kind: 'agent-artifacts', providerId: 'p-art' },
  { kind: 'browser', providerId: 'p-browser' },
];
const tabRegistry = {
  register(definition) { tabTypes.push(definition); return () => {}; },
  guide() { return guideEntries; },
};

const slots = {
  inject(name, callback) { return callback(); },
  register(definition, component) {
    registrations.push({ ...definition, component });
    return () => {};
  },
};

const scope = {
  slots,
  get(name) {
    if (name === 'sidebarRightTabs') return tabRegistry;
    if (name === 'layout') return { openRightbar() { rightbarOpens += 1; } };
    if (name === 'sidebarRight') return {
      openTab(input) { openedTabs.push(input); },
      openResource(address) { openedResources.push(address); },
    };
    return undefined;
  },
  effect(setup) { return setup(); },
  inject(deps, callback) {
    assert.ok(Array.isArray(deps), 'client inject uses an array of service names');
    callback(scope);
  },
};

const ctx = {
  slots,
  get() { return undefined; },
  effect(setup) { return setup(); },
  inject(deps, callback) {
    assert.ok(Array.isArray(deps), 'apply inject uses an array of service names');
    callback(scope);
  },
};

let entry;
globalThis.window = {
  __ModuleLoader__: {
    load(module) { entry = module; },
  },
};

const prefStore = new Map([
  ['dsh-agent-artifacts.prefs', JSON.stringify({ settingsTab: 'filetypes' })],
]);
globalThis.localStorage = {
  getItem: (key) => (prefStore.has(key) ? prefStore.get(key) : null),
  setItem: (key, value) => { prefStore.set(key, String(value)); },
  removeItem: (key) => { prefStore.delete(key); },
};

await import('../client.js');

test('client bundle registers into the sidebar, main, conversation view, turn tail and right sidebar', () => {
  assert.equal(entry.id, 'dsh-agent-artifacts');
  const factory = entry.factory((name) => {
    assert.equal(name, 'react');
    return React;
  });
  assert.deepEqual(factory.inject, ['slots']);
  assert.equal(typeof factory.apply, 'function');
  factory.apply(ctx);

  const byName = (name) => registrations.filter((row) => row.name === name);
  assert.equal(byName('settings.section')[0].id, 'agent-artifacts');
  assert.equal(byName('plugins.bundle.config')[0].key, 'dsh-agent-artifacts');
  assert.equal(byName('plugins.row.config')[0].key, 'dsh-agent-artifacts#agent-artifacts');
  assert.equal(typeof byName('settings.section')[0].component, 'function');
  assert.notEqual(byName('settings.section')[0].component, byName('plugins.bundle.config')[0].component,
    'settings section renders the editable panel, plugin page only a summary');
  assert.equal(byName('plugins.bundle.config')[0].component, byName('plugins.row.config')[0].component);
  assert.equal(byName('sidebar.panellist').length, 0, 'left sidebar entry is off by default');
  assert.equal(byName('main').length, 0, 'workspace page follows the left sidebar entry');
  assert.equal(byName('conversation.view').length, 0, 'session page is off by default');
  assert.equal(byName('conversation.chat.turnTail').length, 0, 'turn tail is off by default');
  assert.deepEqual(byName('sidebar.right.pane.tab').map((row) => row.key).sort(), ['agent-artifacts', 'dsh-agent-artifacts/reader']);
  assert.equal(byName('sidebar.right.pane.tab').length, 2);
  const panelTab = tabTypes.find((row) => row.kind === 'agent-artifacts');
  const readerTab = tabTypes.find((row) => row.kind === 'agent-artifacts-reader');
  assert.equal(panelTab.id, 'agent-artifacts');
  assert.equal(panelTab.guide.length, 1, 'right sidebar entry is on by default');
  assert.equal(panelTab.guide[0].id, 'agent-artifacts');
  assert.deepEqual(readerTab.patterns, ['dsh-resource://artifact/**']);
  assert.ok(byName('sidebar.right.pane.tab').some((row) => row.key === readerTab.id), 'reader body slot is keyed by the tab type id');
  assert.ok(byName('sidebar.right.pane.tab').some((row) => row.key === panelTab.id), 'panel body slot is keyed by the tab type id');
  assert.equal(readerTab.title('dsh-resource://artifact/read/session-1/E:/w/notes.md'), 'notes.md');
  assert.equal(readerTab.canOpen('dsh-resource://artifact/read/session-1/E:/w/notes.md'), true);

  assert.deepEqual(tabRegistry.guide().map((entry) => entry.kind), ['agent-artifacts', 'terminal', 'browser']);
  assert.equal(tabRegistry.guide(), tabRegistry.guide(), 'sorted snapshot stays reference-stable');

  const stored = { getItem(key) { return key === 'dsh-agent-artifacts-guide-order' ? JSON.stringify(['browser', 'terminal']) : null; } };
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: stored });
  assert.deepEqual(tabRegistry.guide().map((entry) => entry.kind), ['browser', 'terminal', 'agent-artifacts']);
  if (previousStorage === undefined) delete globalThis.localStorage;
  else Object.defineProperty(globalThis, 'localStorage', previousStorage);

});

test('location switches enable the left sidebar, session page and turn tail', async () => {
  const store = {
    getItem(key) {
      return key === 'dsh-agent-artifacts-locations'
        ? JSON.stringify({ rail: true, guide: true, turnTail: true, sessionView: true })
        : null;
    },
    setItem() {},
  };
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: store });

  registrations.length = 0;
  tabTypes.length = 0;
  await import('../client.js?locations');
  const enabled = entry.factory((name) => {
    assert.equal(name, 'react');
    return React;
  });
  enabled.apply(ctx);

  const byName = (name) => registrations.filter((row) => row.name === name);
  assert.equal(byName('sidebar.panellist').length, 1);
  assert.equal(byName('main').length, 1);
  assert.equal(byName('conversation.view').length, 1);
  assert.equal(byName('conversation.chat.turnTail').length, 1);
  const panelTab = tabTypes.find((row) => row.kind === 'agent-artifacts');
  assert.equal(panelTab.guide.length, 1);
  assert.equal(typeof panelTab.guide[0].title, 'function');

  const page = byName('main')[0];
  const injected = page.inject();
  injected.openRight('session-2');
  assert.equal(openedTabs[0].sessionId, 'session-2');
  const opened = injected.openFile('session-1', 'E:/w', 'E:/w/a.md');
  assert.equal(opened, true);
  assert.equal(rightbarOpens, 0);
  assert.equal(openedResources[0], 'dsh-resource://artifact/read/session-1/E:/w/a.md', 'markdown opens the reader tab');
  assert.equal(injected.openFile('session-1', 'E:/w', 'E:/w/pic.png'), true);
  assert.equal(openedResources[1], 'dsh-resource://file/session/session-1/pic.png', 'other files keep the native preview');

  const turn = byName('conversation.chat.turnTail')[0];
  const turnProps = turn.inject('session-3');
  assert.equal(turnProps.openFile(undefined, undefined, 'E:/w/c.md'), true);
  assert.equal(openedResources[2], 'dsh-resource://artifact/read/session-3/E:/w/c.md');

  if (previousStorage === undefined) delete globalThis.localStorage;
  else Object.defineProperty(globalThis, 'localStorage', previousStorage);
});

test('settings section renders the file type table', async () => {
  const store = {
    getItem(key) { return key === 'dsh-agent-artifacts.prefs' ? JSON.stringify({ settingsTab: 'filetypes' }) : null; },
    setItem() {},
  };
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: store });
  registrations.length = 0;
  tabTypes.length = 0;
  await import('../client.js?filetypes-smoke');
  const factory = entry.factory(() => React);
  factory.apply(ctx);
  const definition = registrations.find((row) => row.name === 'settings.section' && row.id === 'agent-artifacts');
  assert.ok(definition, 'settings section is registered');
  const tree = definition.component();
  const classes = [];
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { for (const child of node) walk(child); return; }
    if (node.component) { walk(node.component(node.props)); return; }
    if (node.props) {
      if (typeof node.props.className === 'string') classes.push(node.props.className);
      walk(node.props.children);
    }
  };
  walk(tree);
  assert.ok(classes.some((value) => value.includes('dsa-tabs')), 'settings tabs render');
  assert.ok(classes.some((value) => value.includes('dsa-typeTable')), 'file type table renders');
});
