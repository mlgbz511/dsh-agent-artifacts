/**
 * Browser half of dsh-agent-artifacts.
 * 注册三处：侧栏面板图标（sidebar.panellist）、工作区页面（main#agent-artifacts）、会话视图（conversation.view）。
 * 只依赖平台提供的 react；数据通过同源 /api/dsh-agent-artifacts 读取。
 */
window.__ModuleLoader__.load({
  id: 'dsh-agent-artifacts',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useCallback, useEffect, useMemo, useRef, useState } = React;

    const ENDPOINT = '/api/dsh-agent-artifacts';
    const PANEL_ID = 'agent-artifacts';
const PACKAGE_NAME = 'dsh-agent-artifacts';
    const READER_KIND = 'agent-artifacts-reader';

    const TEXT = {
      zh: {
        title: '工件',
        subtitle: 'agent 在会话里提交或生成的文件',
        sessionView: '工件',
        search: '搜索名称、路径或描述',
        allKinds: '全部来源',
        delivered: '提交',
        produced: '生成',
        scanLabel: '扫描',
        allTypes: '全部类型',
        allSessions: '全部工作区',
        sortRecent: '最近提交',
        sortOldest: '最早提交',
        sortName: '名称',
        sortSize: '大小',
        refresh: '刷新',
        loading: '读取中…',
        empty: '这个范围里还没有 agent 提交的工件。',
        emptyHint: '工作区页会自动扫描文档、图片与原型；会话页只列 present / write / edit / register_artifact 过的文件。',
        error: '读取失败',
        retry: '重试',
        menuOpen: '打开',
        menuDetail: '详情',
        menuCopyPath: '复制路径',
        menuReveal: '在资源管理器打开',
        revealed: '已在资源管理器中定位',
        revealFailed: '打开资源管理器失败',
        inferredTag: '推断',
        loadMore: '加载更多',
        missing: '文件已不在磁盘上',
        sensitive: '敏感文件，已隐藏',
        binary: '二进制文件，暂不预览',
        truncated: '仅显示前 200 KB',
        copyPath: '复制路径',
        copyLink: '复制 Markdown 链接',
        copied: '已复制',
        copyFailed: '复制失败',
        close: '关闭',
        preview: '预览',
        noPreview: '没有可用预览',
        sessions: '个会话',
        items: '个工件',
        scopeWorkspace: '工作区',
        scopeSession: '本会话',
        recorded: '记录于第 {turn} 轮',
        occurrences: '记录 {n} 次',
        workingTree: '工作区',
        gitCommits: '共 {n} 次提交',
        localVersion: '非 git 仓库：按 write/edit 记录次数计',
        dirtyMark: '有未提交修改',
        versionMismatch: '前端 {client} · 宿主 {host}，请刷新页面',
        gitHistory: 'Git 历史',
        noGitHistory: '无版本历史（非 Git 仓库或未跟踪）',
        showVersion: '查看此版本',
        versionPreview: '旧版预览',
        changePurpose: '用途',
        workspaceHint: '汇总最近 40 个会话',
        detail: '详情',
        type: '类型',
        size: '大小',
        modified: '修改时间',
        firstSeen: '首次出现',
        lastSeen: '最近出现',
        category: '工件类型',
        openRight: '在右侧栏打开',
        rightHint: '本会话的 agent 工件',
        turnArtifacts: '工件',
        turnMore: '共 {n} 个，打开侧栏',
        plan: '计划',
        walkthrough: '走查',
        changeLabel: '变更',
        evidenceLabel: '证据',
        untaggedLabel: '未标注',
        design: '设计',
        task: '任务',
        prototype: '原型',
        screenshot: '截图',
        document: '文档',
        code: '代码',
        other: '未分类',
        untitled: '未命名会话',
        scanGroup: '工作区文件',
        hideCode: '隐藏代码/配置',
        requestTimeout: '加载超时，请点重试',
        gitLoading: '正在读取 Git 版本',
        gitRetry: 'Git 读取失败，点击重试',
        locationLabel: '入口位置',
        locRail: '左侧栏',
        locGuide: '右侧边栏',
        locTail: '回复尾部',
        locSession: '会话内页',
        locationHint: '选择工件入口出现的位置，默认只在右侧边栏。',
        contentLabel: '内容范围',
        scanToggle: '显示其他对话的工件（工作区扫描）',
        strictPolicy: '严格模式：只显示显式交付/登记',
        strictPolicyHint: '关闭：write/edit 也算工件；开启：只保留 present / register_artifact。',
        scanHint: '关闭时只列本会话提交/生成的工件；打开后附带当前工作区里扫描到的其他文件。',
        scanOnly: '含工作区扫描',
        typesLabel: '工件类型',
        displayLabel: '显示',
        showPath: '显示文件路径',
        showPathHint: '默认精简：列表只显示文件名；打开后显示完整路径。',
        showSourceColumn: '显示「归属」列',
        showSourceColumnHint: '默认隐藏；开启后详情表多一列来源标签。',
        viewModeLabel: '默认视图',
        viewHint: '面板打开时的排列方式，切换后立即生效。',
        viewDetails: '详情',
        viewList: '列表',
        viewTiles: '平铺',
        viewIcons: '图标',
        viewContent: '内容',
        viewTilesEnable: '平铺视图',
        viewContentEnable: '内容视图',
        viewDisableHint: '关闭后从视图切换器移除；当前视图会切回详情。',
        fontSizeLabel: '字体大小',
        fontSmall: '紧凑',
        fontNormal: '标准',
        fontLarge: '舒适',
        fontXLarge: '大',
        fontSizeHint: '只影响工件面板的文字与行距。',
        colName: '名称',
        colKind: '类型',
        colVersion: '版本',
        colTime: '修改时间',
        colSource: '归属',
        diffLabel: '代码差异',
        diagramLabel: '架构图',
        recordingLabel: '浏览器录制',
        interactiveLabel: '交互页面',
        typesHint: '类型由工件格式与来源自动判定；这里只控制面板是否显示。',
        tabEntry: '入口位置',
        locRailHint: '侧栏图标 + 工作区工件页',
        locGuideHint: '开始页入口 + 右侧工件面板',
        locTailHint: '每轮回复末尾的工件条',
        locSessionHint: '会话里的「工件」视图',
        typesAllVisible: '全部类型可见',
        typesHidden: '已隐藏',
        tabContent: '内容范围',
        tabTypes: '工件类型',
        tabDisplay: '显示排版',
        tabAbout: '关于',
        tabIcons: '图标映射',
        tabMapping: '映射表',
        tabFileTypes: '文件类型',
        groupByLabel: '分组方式',
        groupByPurpose: '工件类型',
        groupByFile: '文件类型',
        groupBySession: '会话',
        kindIcon: '改图标',
        kindNew: '新建工件类型',
        kindEdit: '编辑类型',
        kindDelete: '删除类型',
        kindDeleteConfirm: '删除后相关标签将回到未标注，继续？',
        kindLimit: '最多 20 个自定义工件类型',
        kindNameRequired: '类型名称不能为空',
        kindResetIcon: '恢复默认图标',
        kindIconTitle: '选择工件类型图标',
        kindTone: '色调',
        kindSaved: '工件类型已保存',
        kindDeleted: '工件类型已删除',
        kindCustomTag: '自定义',
        groupByHint: '选择列表分组方式；默认按工件类型。',
        ftHint: '图标绑定的是「文件类型组」：一组可含一个或多个扩展名与特殊文件名。扩展名全组唯一，新增会自动从旧组移出。',
        ftGroups: '文件类型组',
        ftKinds: '工件类型',
        ftNew: '新建类型',
        ftReset: '恢复默认',
        ftSearch: '搜索类型、扩展名或图标',
        ftTypeCol: '类型',
        ftMembers: '成员',
        ftActions: '操作',
        ftBuiltin: '内置',
        ftCustom: '自定义',
        ftNoMembers: '未绑定任何格式',
        ftChangeIcon: '换图标',
        ftEdit: '编辑',
        ftDelete: '删除',
        ftName: '类型名称',
        ftNamePlaceholder: '如：音频',
        ftIconLabel: '图标',
        ftExtLabel: '扩展名（回车或逗号添加，不含点）',
        ftExtPlaceholder: '输入扩展名后回车',
        ftSpecialLabel: '特殊文件名（如 README*、package.json）',
        ftSpecialPlaceholder: '输入文件名后回车',
        ftNameRequired: '类型名称不能为空',
        ftLimit: '类型组或扩展名数量已达上限',
        ftSaved: '已保存',
        ftCreated: '已新建类型',
        ftDeleted: '已删除类型',
        ftResetDone: '已恢复默认类型',
        ftIconDone: '图标已更新',
        ftNoMatch: '没有匹配的类型',
        ftPreview: '解析预览',
        ftPreviewHint: '样例按「特殊文件名 → 扩展名」找类型，再用组图标；都未命中显示 kind 兜底瓷片。',
        ftDeleteShort: '删除',
        columns: '列',
        columnsHint: '勾选显示，箭头调序',
        columnsReset: '恢复默认列',
        columnsMinOne: '至少保留一列',
        scopeOnly: '仅当前工作区',
        scopeOutside: '个工作区外工件',
        scopeShowAll: '显示全部',
        scopeEmptyHint: '当前工作区内没有工件，工作区外还有',
        provDelivered: '交付',
        provWritten: '写入',
        provScan: '扫描',
        provOther: '其他会话',
        mapHint: '类型与图标是两套独立映射：类型决定分类/筛选，图标由扩展名与特殊文件名决定；未命中图标才用类型兜底瓷片。',
        mapKinds: '类型 → 文件',
        mapIcons: '图标 → 文件',
        mapOverrides: '自定义覆盖',
        mapKindCol: '类型',
        mapRepIcon: '代表图标',
        mapRules: '判定规则',
        mapSample: '文件示例',
        mapShow: '显示',
        mapIconCol: '图标',
        mapId: 'id',
        mapExt: '扩展名',
        mapSpecial: '特殊文件名',
        mapAction: '操作',
        mapUseIcon: '用此图标覆盖',
        assignTitle: '用此图标覆盖文件',
        recolorTitle: '更换图标',
        dialogHint: '匹配值可以是扩展名（.foo）、文件名（README.md）或完整路径。',
        dialogCancel: '取消',
        dialogAdd: '添加覆盖',
        dialogSave: '保存',
        changeIcon: '换图标',
        iconChanged: '图标已更新',
        mapSearch: '搜索图标 id 或扩展名',
        mapKindsFooter: '用途由 agent 在 register_artifact 时显式选择；开关只控制面板可见性。',
        mapIconsFooter: '覆盖项优先于上表；同一「粒度 + 匹配值」重复添加会覆盖旧项。',
        kindRulePlan: 'agent 声明为实施计划 / 任务拆解',
        kindRuleWalkthrough: 'agent 声明为任务完成总结',
        kindRuleChange: 'agent 声明为 diff / patch 变更集',
        kindRuleDiagram: 'agent 声明为架构图 / 流程图',
        kindRuleEvidence: 'agent 声明为截图或浏览器录制',
        kindRulePreview: 'agent 声明为可浏览页面 / 预览',
        kindRuleDocument: 'agent 声明为报告、说明或表格',
        kindRuleCode: 'agent 声明为源码或配置',
        kindRuleOther: 'agent 选择了其他',
        kindRuleUntagged: 'agent 未声明用途（普通 write/edit 或未登记的 present）',
        settingsHere: '完整设置在「设置 → 工件」中管理；这里只显示摘要。',
        iconsHint: '默认映射写死在插件里；这里为单个文件或一类扩展名指定覆盖图标，恢复默认即清空自定义。',
        iconsList: '自定义覆盖',
        iconsEmpty: '还没有自定义映射，全部使用内置图标。',
        iconsAdd: '添加映射',
        iconsLevelExt: '扩展名',
        iconsLevelName: '文件名',
        iconsLevelPath: '完整路径',
        iconsMatch: '匹配值',
        iconsPick: '选择图标',
        iconsSearch: '搜索图标',
        iconsAddButton: '添加映射',
        iconsRemove: '删除',
        iconsCount: '自定义映射',
        iconsPreview: '解析预览',
        iconsPreviewHint: '优先级：完整路径 → 文件名 → 扩展名 → 内置特殊名 → 内置扩展名 → kind 兜底。',
        iconsSourcePath: '路径覆盖',
        iconsSourceName: '文件名覆盖',
        iconsSourceExt: '扩展名覆盖',
        iconsSourceSpecial: '内置特殊名',
        iconsSourceExtension: '内置扩展名',
        iconsSourceFallback: 'kind 兜底',
        iconsReset: '恢复默认映射',
        iconsDuplicate: '已覆盖同粒度同匹配值的旧映射',
        iconsLimit: '最多 200 条自定义映射。',
        settingsReset: '恢复本页默认',
        resetDone: '已恢复默认',
        resetAll: '全部恢复默认',
        resetAllConfirm: '再次点击确认',
        prefsScope: '偏好保存在本机浏览器（localStorage），不随会话同步。',
        scanLimit: '扫描上限：800 项 / 6 层；忽略 node_modules、.git、dist 等目录。',
        hideCodeDefault: '默认隐藏代码/配置',
        hideCodeDefaultHint: '只显示在设置页；关闭后显示代码与配置文件。',
        scopeOnlyHint: '只显示当前工作区内的工件；关闭后显示其他目录与会话的文件。',
        scopeInsideHint: '当前工作区内有 {n} 个工件，工作区外还有',
        noEntryWarning: '当前没有可见入口，可从本页重新打开。',
        defaultSort: '默认排序',
        sortTime: '时间（新→旧）',
        sortName: '名称',
        sortKind: '类型',
        densityLabel: '行密度',
        densityComfortable: '舒适',
        densityCompact: '紧凑',
        previewLabel: '预览',
        aboutPlugin: '插件',
        aboutVersion: '版本',
        aboutEntrySummary: '入口',
        aboutTypeSummary: '类型',
        aboutIconSource: '图标来源',
        aboutScope: '偏好作用域',
        aboutReset: '重置',
        kindGroupDeliverable: '交付物',
        kindGroupVisual: '视觉',
        kindGroupPage: '页面',
        kindGroupFile: '文件与兜底',
        kindDescPlan: '实施计划与任务拆解',
        kindDescWalkthrough: '任务完成后的变更总结',
        kindDescChange: '*.diff / *.patch 变更集',
        kindDescDiagram: '*.mmd / *.drawio 架构与流程图',
        kindDescEvidence: '截图、浏览器录制等审阅证据',
        kindDescPreview: 'html 页面与可浏览预览',
        kindDescUntagged: '普通写入，agent 未声明用途',
        kindDescDocument: 'md/pdf/docx/xlsx 等文档',
        kindDescCode: '源码与配置；仍受“隐藏代码/配置”影响',
        kindDescOther: '未命中任何类型的其余文件',
        locSidebarOnly: '仅右侧边栏',
        readerTitle: 'Markdown',
        readerLoading: '正在读取…',
        readerError: '无法读取该文件',
        readerMissing: '文件不存在',
        readerTruncated: '内容较大，仅显示前 200 KB',
      },
      en: {
        title: 'Artifacts',
        subtitle: 'Files agents delivered or produced in Sessions',
        sessionView: 'Artifacts',
        search: 'Search name, path, or description',
        allKinds: 'All sources',
        delivered: 'Delivered',
        produced: 'Produced',
        scanLabel: 'Scanned',
        allTypes: 'All types',
        allSessions: 'All workspaces',
        sortRecent: 'Recently delivered',
        sortOldest: 'Earliest',
        sortName: 'Name',
        sortSize: 'Size',
        refresh: 'Refresh',
        loading: 'Loading…',
        empty: 'No artifacts in this scope yet.',
        emptyHint: 'The workspace page scans documents, images and prototypes; the Session page lists files delivered or produced by the agent.',
        error: 'Failed to load',
        retry: 'Retry',
        menuOpen: 'Open',
        menuDetail: 'Details',
        menuCopyPath: 'Copy path',
        menuReveal: 'Reveal in Explorer',
        revealed: 'Revealed in Explorer',
        revealFailed: 'Could not reveal in Explorer',
        inferredTag: 'inferred',
        loadMore: 'Load more',
        missing: 'File is no longer on disk',
        sensitive: 'Sensitive file, hidden',
        binary: 'Binary file, no preview',
        truncated: 'Showing first 200 KB',
        copyPath: 'Copy path',
        copyLink: 'Copy Markdown link',
        copied: 'Copied',
        copyFailed: 'Copy failed',
        close: 'Close',
        preview: 'Preview',
        noPreview: 'No preview available',
        sessions: 'sessions',
        items: 'artifacts',
        scopeWorkspace: 'Workspace',
        scopeSession: 'This Session',
        recorded: 'Turn {turn}',
        occurrences: 'recorded {n}×',
        workingTree: 'Working tree',
        gitCommits: '{n} commits',
        localVersion: 'Not a Git repo: counted from write/edit records',
        dirtyMark: 'Uncommitted changes',
        versionMismatch: 'Client {client} · host {host}; refresh the page',
        gitHistory: 'Git history',
        noGitHistory: 'No version history (not a Git repo or untracked)',
        showVersion: 'View this version',
        versionPreview: 'Old revision preview',
        changePurpose: 'Purpose',
        workspaceHint: 'Newest 40 Sessions',
        detail: 'Details',
        type: 'Type',
        size: 'Size',
        modified: 'Modified',
        firstSeen: 'First seen',
        lastSeen: 'Last seen',
        category: 'Artifact kind',
        openRight: 'Open in right sidebar',
        rightHint: 'Agent artifacts of this Session',
        turnArtifacts: 'Artifacts',
        turnMore: '{n} total, open sidebar',
        plan: 'Plan',
        walkthrough: 'Walkthrough',
        changeLabel: 'Change',
        evidenceLabel: 'Evidence',
        untaggedLabel: 'Untagged',
        design: 'Design',
        task: 'Task',
        prototype: 'Prototype',
        screenshot: 'Screenshot',
        document: 'Document',
        code: 'Code',
        other: 'Unclassified',
        untitled: 'Untitled Session',
        scanGroup: 'Workspace files',
        hideCode: 'Hide code/config',
        requestTimeout: 'Loading timed out; retry',
        gitLoading: 'Reading Git version',
        gitRetry: 'Git lookup failed; click to retry',
        locationLabel: 'Entry locations',
        locRail: 'Left sidebar',
        locGuide: 'Right sidebar',
        locTail: 'Turn tail',
        locSession: 'Session page',
        locationHint: 'Where the artifacts entry appears. Default: right sidebar only.',
        contentLabel: 'Content scope',
        scanToggle: 'Show artifacts from other conversations (workspace scan)',
        strictPolicy: 'Strict mode: explicit deliveries only',
        strictPolicyHint: 'Off: write/edit files count as artifacts. On: only present / register_artifact entries remain.',
        scanHint: 'Off: only artifacts this Session delivered or produced. On: also files scanned from the workspace.',
        scanOnly: 'incl. workspace scan',
        typesLabel: 'Artifact types',
        displayLabel: 'Display',
        showPath: 'Show file paths',
        showPathHint: 'Compact by default: rows show the file name only. Turn on to show full paths.',
        showSourceColumn: 'Show the Origin column',
        showSourceColumnHint: 'Hidden by default; adds the provenance tag column to the details table.',
        viewModeLabel: 'Default view',
        viewHint: 'Layout used when the panel opens; changes apply immediately.',
        viewDetails: 'Details',
        viewList: 'List',
        viewTiles: 'Tiles',
        viewIcons: 'Icons',
        viewContent: 'Content',
        viewTilesEnable: 'Tiles view',
        viewContentEnable: 'Content view',
        viewDisableHint: 'Hide this view from the switcher; an active view falls back to Details.',
        fontSizeLabel: 'Font size',
        fontSmall: 'Compact',
        fontNormal: 'Default',
        fontLarge: 'Comfortable',
        fontXLarge: 'Large',
        fontSizeHint: 'Affects the artifact panel typography only.',
        colName: 'Name',
        colKind: 'Kind',
        colVersion: 'Version',
        colTime: 'Modified',
        colSource: 'Origin',
        diffLabel: 'Code diff',
        diagramLabel: 'Architecture diagram',
        recordingLabel: 'Browser recording',
        interactiveLabel: 'Interactive HTML',
        typesHint: 'Kinds are inferred from the artifact format and origin; this only controls panel visibility.',
        tabEntry: 'Locations',
        locRailHint: 'Sidebar icon + workspace page',
        locGuideHint: 'Start-page entry + right panel',
        locTailHint: 'Artifact strip under each reply',
        locSessionHint: 'The artifacts view inside a session',
        typesAllVisible: 'All kinds visible',
        typesHidden: 'hidden',
        tabContent: 'Content',
        tabTypes: 'Kinds',
        tabDisplay: 'Typography',
        tabAbout: 'About',
        tabIcons: 'Icon mapping',
        tabMapping: 'Mapping',
        tabFileTypes: 'File types',
        groupByLabel: 'Group by',
        groupByPurpose: 'Artifact type',
        groupByFile: 'File type',
        groupBySession: 'Session',
        kindIcon: 'Icon',
        kindNew: 'New artifact type',
        kindEdit: 'Edit type',
        kindDelete: 'Delete type',
        kindDeleteConfirm: 'Tags using this type will return to untagged. Continue?',
        kindLimit: 'Up to 20 custom artifact types',
        kindNameRequired: 'Type name is required',
        kindResetIcon: 'Reset icon',
        kindIconTitle: 'Choose artifact type icon',
        kindTone: 'Tone',
        kindSaved: 'Artifact type saved',
        kindDeleted: 'Artifact type deleted',
        kindCustomTag: 'custom',
        groupByHint: 'Choose how the list is grouped. Artifact type is the default.',
        ftHint: 'Icons bind to file type groups. A group holds one or more extensions plus special filenames. An extension belongs to one group; adding it elsewhere moves it.',
        ftGroups: 'Type groups',
        ftKinds: 'Artifact kinds',
        ftNew: 'New type',
        ftReset: 'Restore defaults',
        ftSearch: 'Search type, extension or icon',
        ftTypeCol: 'Type',
        ftMembers: 'Members',
        ftActions: 'Actions',
        ftBuiltin: 'built-in',
        ftCustom: 'custom',
        ftNoMembers: 'No formats bound',
        ftChangeIcon: 'Change icon',
        ftEdit: 'Edit',
        ftDelete: 'Delete',
        ftName: 'Type name',
        ftNamePlaceholder: 'e.g. Audio',
        ftIconLabel: 'Icon',
        ftExtLabel: 'Extensions (Enter or comma, no dot)',
        ftExtPlaceholder: 'Type an extension, then Enter',
        ftSpecialLabel: 'Special filenames (e.g. README*, package.json)',
        ftSpecialPlaceholder: 'Type a filename, then Enter',
        ftNameRequired: 'Type name is required',
        ftLimit: 'Type or extension limit reached',
        ftSaved: 'Saved',
        ftCreated: 'Type created',
        ftDeleted: 'Type deleted',
        ftResetDone: 'Default types restored',
        ftIconDone: 'Icon updated',
        ftNoMatch: 'No matching type',
        ftPreview: 'Resolution preview',
        ftPreviewHint: 'Samples resolve by special filename, then extension, then the group icon; misses fall back to the kind tile.',
        ftDeleteShort: 'Delete',
        columns: 'Columns',
        columnsHint: 'Toggle visibility, arrows reorder',
        columnsReset: 'Reset columns',
        columnsMinOne: 'Keep at least one column',
        scopeOnly: 'Only current workspace',
        scopeOutside: 'artifacts outside the workspace',
        scopeShowAll: 'Show all',
        scopeEmptyHint: 'No artifacts inside the workspace; plus',
        provDelivered: 'Delivered',
        provWritten: 'Written',
        provScan: 'Scanned',
        provOther: 'Other session',
        mapHint: 'Kinds and icons are two independent maps: kinds decide classification/filtering, icons come from extensions and special filenames; only unmatched files fall back to the kind tile.',
        mapKinds: 'Kinds → files',
        mapIcons: 'Icons → files',
        mapOverrides: 'Overrides',
        mapKindCol: 'Kind',
        mapRepIcon: 'Icon',
        mapRules: 'Rules',
        mapSample: 'Example',
        mapShow: 'Show',
        mapIconCol: 'Icon',
        mapId: 'id',
        mapExt: 'Extensions',
        mapSpecial: 'Special filenames',
        mapAction: 'Action',
        mapUseIcon: 'Override with this icon',
        assignTitle: 'Override a file with this icon',
        recolorTitle: 'Change icon',
        dialogHint: 'Match can be an extension (.foo), a file name (README.md) or a full path.',
        dialogCancel: 'Cancel',
        dialogAdd: 'Add override',
        dialogSave: 'Save',
        changeIcon: 'Change icon',
        iconChanged: 'Icon updated',
        mapSearch: 'Search icon id or extension',
        mapKindsFooter: 'The agent chooses the purpose in register_artifact; these switches only control visibility.',
        mapIconsFooter: 'Overrides beat the table above; adding the same level and match replaces the old entry.',
        kindRulePlan: 'The agent declares an implementation plan or task breakdown.',
        kindRuleWalkthrough: 'The agent declares a post-task summary.',
        kindRuleChange: 'The agent declares a diff / patch change set.',
        kindRuleDiagram: 'The agent declares an architecture or flow diagram.',
        kindRuleEvidence: 'The agent declares a screenshot or browser recording.',
        kindRulePreview: 'The agent declares a browsable page or preview.',
        kindRuleDocument: 'The agent declares a report, note or sheet.',
        kindRuleCode: 'The agent declares source code or config.',
        kindRuleOther: 'The agent chose other.',
        kindRuleUntagged: 'No purpose declared (ordinary write/edit or unregistered present).',
        settingsHere: 'Full settings live under Settings → Artifacts; this page only shows a summary.',
        iconsHint: 'Default mapping is hardcoded in the plugin. Add overrides per path, filename or extension; restoring defaults clears them.',
        iconsList: 'Custom overrides',
        iconsEmpty: 'No overrides yet; the built-in mapping is in use.',
        iconsAdd: 'Add override',
        iconsLevelExt: 'Extension',
        iconsLevelName: 'File name',
        iconsLevelPath: 'Full path',
        iconsMatch: 'Match',
        iconsPick: 'Choose an icon',
        iconsSearch: 'Search icons',
        iconsAddButton: 'Add',
        iconsRemove: 'Remove',
        iconsCount: 'overrides',
        iconsPreview: 'Resolution preview',
        iconsPreviewHint: 'Precedence: path → file name → extension → built-in special name → built-in extension → kind fallback.',
        iconsSourcePath: 'path override',
        iconsSourceName: 'name override',
        iconsSourceExt: 'extension override',
        iconsSourceSpecial: 'built-in special name',
        iconsSourceExtension: 'built-in extension',
        iconsSourceFallback: 'kind fallback',
        iconsReset: 'Restore default mapping',
        iconsDuplicate: 'Replaced an existing override with the same level and match',
        iconsLimit: 'At most 200 custom overrides.',
        settingsReset: 'Reset this tab',
        resetDone: 'Defaults restored',
        resetAll: 'Reset all settings',
        resetAllConfirm: 'Click again to confirm',
        prefsScope: 'Preferences live in this browser (localStorage); they do not follow sessions.',
        scanLimit: 'Scan limit: 800 items / 6 levels; node_modules, .git, dist and similar are skipped.',
        hideCodeDefault: 'Hide code/config by default',
        hideCodeDefaultHint: 'Shown only in Settings; turn off to include code and config files.',
        scopeOnlyHint: 'Show only artifacts inside the current workspace; turn off to include other folders and sessions.',
        scopeInsideHint: 'Workspace contains {n} artifacts; outside the workspace:',
        noEntryWarning: 'No entry is visible right now; re-enable one on this tab.',
        defaultSort: 'Default sort',
        sortTime: 'Time (newest first)',
        sortName: 'Name',
        sortKind: 'Kind',
        densityLabel: 'Row density',
        densityComfortable: 'Comfortable',
        densityCompact: 'Compact',
        previewLabel: 'Preview',
        aboutPlugin: 'Plugin',
        aboutVersion: 'Version',
        aboutEntrySummary: 'Entries',
        aboutTypeSummary: 'Kinds',
        aboutIconSource: 'Icon source',
        aboutScope: 'Preference scope',
        aboutReset: 'Reset',
        kindGroupDeliverable: 'Deliverables',
        kindGroupVisual: 'Visual',
        kindGroupPage: 'Pages',
        kindGroupFile: 'Files and fallback',
        kindDescPlan: 'Implementation plans and task breakdowns.',
        kindDescWalkthrough: 'Post-task change summaries.',
        kindDescChange: '*.diff / *.patch change sets.',
        kindDescDiagram: '*.mmd / *.drawio architecture and flow diagrams.',
        kindDescEvidence: 'Screenshots and browser recordings for review.',
        kindDescPreview: 'HTML pages and browsable previews.',
        kindDescUntagged: 'Ordinary writes with no stated purpose.',
        kindDescDocument: 'Reports, notes, sheets and presentations.',
        kindDescCode: 'Sources and configs; still subject to Hide code/config',
        kindDescOther: 'Files that match no kind',
        locSidebarOnly: 'Right sidebar only',
        readerTitle: 'Markdown',
        readerLoading: 'Loading…',
        readerError: 'Could not read this file',
        readerMissing: 'File not found',
        readerTruncated: 'Large file, showing the first 200 KB',
      },
    };

    function detectLanguage() {
      try {
        const locale = globalThis.__DSH_LOCALE_ID__;
        if (typeof locale === 'string' && locale !== '') return /^zh/i.test(locale) ? 'zh' : 'en';
      } catch {
        // fall through
      }
      const language = (globalThis.navigator && navigator.language) || 'zh-CN';
      return /^zh/i.test(language) ? 'zh' : 'en';
    }

    let language = typeof document !== 'undefined' ? detectLanguage() : 'zh';
    function t() {
      return TEXT[language] ?? TEXT.zh;
    }
    function format(template, values) {
      return template.replace(/\{(\w+)\}/g, (_, key) => (values[key] === undefined ? '' : String(values[key])));
    }

    async function request(operation, payload, signal, timeoutMs = 12000) {
      const controller = new AbortController();
      let timedOut = false;
      const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
      const forwardAbort = () => controller.abort();
      if (signal) {
        if (signal.aborted) controller.abort();
        else signal.addEventListener('abort', forwardAbort, { once: true });
      }
      try {
        const response = await fetch(ENDPOINT, {
          method: 'POST',
          signal: controller.signal,
          cache: 'no-store',
          headers: { 'content-type': 'application/json', 'x-dsh-agent-artifacts': '1' },
          body: JSON.stringify({ operation, ...payload }),
        });
        const body = await response.json().catch(() => null);
        if (!response.ok || !body || body.ok === false) {
          const message = body && body.error ? body.error.message : 'HTTP ' + response.status;
          throw new Error(message);
        }
        return body.data;
      } catch (error) {
        if (timedOut) throw new Error(t().requestTimeout);
        throw error;
      } finally {
        clearTimeout(timer);
        if (signal) signal.removeEventListener('abort', forwardAbort);
      }
    }

    function formatBytes(bytes) {
      if (!Number.isFinite(bytes) || bytes <= 0) return '—';
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      let value = bytes;
      let index = 0;
      while (value >= 1024 && index < units.length - 1) {
        value /= 1024;
        index += 1;
      }
      return (value >= 10 || index === 0 ? Math.round(value) : value.toFixed(1)) + ' ' + units[index];
    }

    function formatTime(value) {
      if (!Number.isFinite(value) || value <= 0) return '—';
      try {
        return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
        }).format(new Date(value));
      } catch {
        return new Date(value).toLocaleString();
      }
    }

    function kindLabel(kind) {
      if (kind === 'delivered') return t().delivered;
      if (kind === 'produced') return t().produced;
      return t().scanLabel;
    }

    function categoryLabel(category) {
      return kindLabelOf(category);
    }

    function encodeSegment(segment) {
      return encodeURIComponent(segment).replace(/%3A/gi, ':');
    }

    function encodePath(value) {
      return value.split('/').map(encodeSegment).join('/');
    }

    /** 与 DSH 的 dsh-resource://file 语法一致：会话内相对路径优先，外部路径保持绝对。 */
    function fileAddressFor(sessionId, cwd, path) {
      const normalized = String(path).replace(/\\/g, '/');
      const absolute = normalized.startsWith('/') || /^[A-Za-z]:\//.test(normalized) || normalized.startsWith('//');
      const base = typeof cwd === 'string' && cwd !== '' ? cwd.replace(/\\/g, '/').replace(/\/+$/, '') : '';
      let target = normalized;
      if (absolute && base !== '') {
        if (normalized === base) target = '';
        else if (normalized.startsWith(base + '/')) target = normalized.slice(base.length + 1);
      }
      target = target.replace(/^(?:\.\/)+/, '');
      return 'dsh-resource://file/session/' + encodeSegment(sessionId) + '/' + encodePath(target);
    }

    const TYPE_LABEL = {
      doc: 'DOC', sheet: 'SHEET', slides: 'SLIDE', image: 'IMG', vector: 'SVG', video: 'VIDEO',
      audio: 'AUDIO', code: 'CODE', config: 'CONF', web: 'WEB', archive: 'ZIP', other: 'FILE',
    };

    const CSS = [
      ':root{--dsa-fs:13px;--dsa-fs-sm:12px;--dsa-fs-xs:11px;--dsa-fs-lg:15px}',
      '.dsa-page{--dsa-fs:13px;--dsa-fs-sm:12px;--dsa-fs-xs:11px;--dsa-fs-lg:15px;display:flex;flex-direction:column;min-height:0;height:100%;color:var(--dsw-alias-label-primary);font-size:var(--dsa-fs)}',
      '.dsa-page[data-font="sm"]{--dsa-fs:12px;--dsa-fs-sm:11px;--dsa-fs-xs:10px;--dsa-fs-lg:14px}',
      '.dsa-page[data-font="lg"]{--dsa-fs:14px;--dsa-fs-sm:13px;--dsa-fs-xs:12px;--dsa-fs-lg:16px}',
      '.dsa-page[data-font="xl"]{--dsa-fs:15px;--dsa-fs-sm:14px;--dsa-fs-xs:13px;--dsa-fs-lg:17px}',
      '.dsa-kicon{display:inline-flex;align-items:center;justify-content:center;flex:none;box-shadow:inset 0 0 0 1px rgba(255,255,255,.14)}',
      '.dsa-ficon{display:inline-flex;align-items:center;justify-content:center;flex:none}',
      '.dsa-ficon svg{width:100%;height:100%;display:block}',
      '.dsa-kicon svg{display:block}',
      '.dsa-page *{box-sizing:border-box}',
      '.dsa-header{display:flex;align-items:center;gap:8px;padding:14px 16px 8px}',
      '.dsa-headText{flex:1 1 auto;min-width:0;display:flex;align-items:baseline;gap:8px;overflow:hidden}',
      '.dsa-title{font-size:var(--dsa-fs-lg);font-weight:600;line-height:1.3;margin:0;flex:none}',
      '.dsa-count{font-size:var(--dsa-fs-sm);color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsa-toolbar{display:flex;flex-wrap:wrap;gap:8px;padding:0 16px 8px;align-items:center}',
      '.dsa-input,.dsa-select{height:28px;padding:0 8px;border-radius:6px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:inherit;font-size:var(--dsa-fs-sm);min-width:0}',
      '.dsa-input{flex:1 1 180px}',
      '.dsa-select{max-width:100%}',
      '.dsa-button,.dsa-iconButton{height:28px;border-radius:6px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:inherit;font-size:var(--dsa-fs-sm);cursor:pointer;transition:background 150ms}',
      '.dsa-button{padding:0 10px}',
      '.dsa-iconButton{width:28px;padding:0;font-size:var(--dsa-fs-lg);line-height:1;flex:none}',
      '.dsa-button:hover,.dsa-iconButton:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.dsa-button:active,.dsa-iconButton:active{background:var(--dsw-alias-bg-layer-3)}',
      '.dsa-button:focus-visible,.dsa-iconButton:focus-visible,.dsa-input:focus-visible,.dsa-select:focus-visible,.dsa-row:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.dsa-button[disabled],.dsa-iconButton[disabled]{opacity:.5;cursor:default}',
      '.dsa-list{flex:1 1 auto;min-height:0;overflow:auto;padding:0 8px 24px}',
      '.dsa-groupBlock{display:block}',
      '.dsa-group{position:sticky;top:0;z-index:2;display:flex;align-items:baseline;gap:8px;padding:10px 8px 6px;background:var(--dsw-alias-bg-base);font-size:var(--dsa-fs-sm);font-weight:600;color:var(--dsw-alias-label-secondary)}',
      '.dsa-groupTitle{flex:none;max-width:62%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsa-groupHint{flex:1 1 auto;min-width:0;font-weight:400;font-size:var(--dsa-fs-xs);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}',
      '.dsa-groupCount{flex:none;font-weight:400;font-size:var(--dsa-fs-xs)}',
      '.dsa-row{display:flex;align-items:center;gap:10px;min-height:44px;padding:6px 8px;border-radius:8px;cursor:pointer;background:transparent;border:none;text-align:left;width:100%;font:inherit;color:inherit;transition:background 150ms}',
      '.dsa-row:hover{background:var(--dsw-alias-bg-layer-1)}',
      '.dsa-list[data-compact="true"] .dsa-row{min-height:40px;padding:8px 10px;margin-bottom:2px}',
      '.dsa-row:active{background:var(--dsw-alias-bg-layer-2)}',
      '.dsa-ext{flex:none;width:38px;height:24px;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;background:var(--dsw-alias-bg-layer-1);font-size:9px;font-weight:600;letter-spacing:.02em;color:var(--dsw-alias-label-secondary)}',
      '.dsa-ext[data-type="doc"]{color:var(--dsw-alias-brand-primary)}',
      '.dsa-ext[data-type="image"],.dsa-ext[data-type="vector"]{color:var(--dsw-alias-state-success-primary)}',
      '.dsa-ext[data-type="web"]{color:var(--dsw-alias-state-warn-primary)}',
      '.dsa-body{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:1px}',
      '.dsa-name{font-size:var(--dsa-fs);line-height:1.35;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsa-path{font-size:var(--dsa-fs-xs);color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}',
      '.dsa-side{flex:none;display:flex;align-items:center;gap:6px;font-size:var(--dsa-fs-xs);color:var(--dsw-alias-label-secondary);white-space:nowrap}',
      '.dsa-check{display:inline-flex;align-items:center;gap:6px;font-size:var(--dsa-fs-sm);color:var(--dsw-alias-label-secondary);white-space:nowrap;cursor:pointer}',
      '.dsa-check input{accent-color:var(--dsw-alias-brand-primary);margin:0}',
      '.dsa-tabs{display:flex;gap:2px;margin:2px 0 12px;border-bottom:1px solid var(--dsw-alias-border-l1);overflow-x:auto;scrollbar-width:none}',
      '.dsa-tabs::-webkit-scrollbar{display:none}',
      '.dsa-tab{position:relative;height:34px;padding:0 10px;border:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:var(--dsa-fs-sm);cursor:pointer;white-space:nowrap;border-radius:6px 6px 0 0}',
      '.dsa-tab:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1)}',
      '.dsa-tab[aria-selected="true"]{color:var(--dsw-alias-label-primary);font-weight:600}',
      '.dsa-tab[aria-selected="true"]::after{content:"";position:absolute;left:8px;right:8px;bottom:-1px;height:2px;border-radius:2px;background:var(--dsw-alias-brand-primary)}',
      '.dsa-tab:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.dsa-panel{display:flex;flex-direction:column}',
      '.dsa-prefRow{justify-content:space-between;gap:12px;padding:8px 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);margin-bottom:6px}',
      '.dsa-prefRow .dsa-kindName{font-size:var(--dsa-fs)}',
      '.dsa-warn{margin:6px 0 0;font-size:var(--dsa-fs-sm);color:var(--dsw-alias-state-warn-primary)}',
      '.dsa-resetRow{display:flex;align-items:center;gap:8px;margin-top:12px}',
      '.dsa-resetRow .dsa-button{margin-left:auto}',
      '.dsa-typeSearch{width:100%;margin:0 0 8px}',
      '.dsa-preview{margin-top:10px;padding:8px;border-radius:10px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}',
      '.dsa-previewHead{display:flex;align-items:center;justify-content:space-between;padding:0 4px 6px;font-size:var(--dsa-fs-sm);color:var(--dsw-alias-label-secondary)}',
      '.dsa-previewRow{display:flex;align-items:center;gap:9px;padding:6px 6px;border-radius:6px}',
      '.dsa-previewRow:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.dsa-previewRow .dsa-path{flex:1;min-width:0}',
      '.dsa-previewRow .dsa-count{margin-left:auto;white-space:nowrap}',
      '.dsa-about{display:grid;grid-template-columns:120px 1fr;gap:8px 14px;margin:8px 0 0;font-size:var(--dsa-fs-sm)}',
      '.dsa-about dt{color:var(--dsw-alias-label-secondary)}',
      '.dsa-about dd{margin:0;color:var(--dsw-alias-label-primary);overflow-wrap:anywhere}',
      '.dsa-list[data-density="compact"] .dsa-listRow{min-height:26px;padding:2px 8px}',
      '.dsa-list[data-density="compact"] .dsa-dtable td{padding:4px 8px}',
      '.dsa-list[data-density="compact"] .dsa-contentRow{padding:7px 8px}',
      '.dsa-list[data-density="compact"] .dsa-tileGrid{gap:6px}',
      '.dsa-ovList{display:flex;flex-direction:column;gap:2px;margin-bottom:4px}',
      '.dsa-ovRow{display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}',
      '.dsa-ovRow:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.dsa-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:var(--dsa-fs-sm);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsa-addRow{display:grid;grid-template-columns:118px minmax(0,1fr) auto;gap:8px;align-items:center}',
      '.dsa-levelSelect{max-width:118px}',
      '.dsa-picker{margin-top:8px;padding:10px;border-radius:9px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}',
      '.dsa-iconGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(58px,1fr));gap:4px;max-height:210px;overflow:auto;margin-top:8px}',
      '.dsa-iconCell{display:flex;flex-direction:column;align-items:center;gap:3px;padding:7px 4px;border:1px solid transparent;border-radius:7px;background:transparent;color:var(--dsw-alias-label-tertiary);font:inherit;font-size:10px;cursor:pointer;min-width:0}',
      '.dsa-iconCell:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.dsa-iconCell[aria-pressed="true"]{border-color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.dsa-iconCell span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsa-iconCell .dsa-previewIcon{width:22px;height:22px}',
      '.dsa-previewIcon{display:inline-flex;align-items:center;justify-content:center;flex:none}',
      '.dsa-previewIcon svg{width:100%;height:100%;display:block}',
      '.dsa-chosenInline{display:inline-flex;align-items:center;gap:6px}',
      '.dsa-chosenInline .dsa-previewIcon{width:18px;height:18px}',
      '.dsa-resolve{display:flex;flex-direction:column;gap:2px;margin-top:4px}',
      '.dsa-resolveRow{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:7px}',
      '.dsa-resolveRow:hover{background:var(--dsw-alias-bg-layer-1)}',
      '.dsa-resolveRow .dsa-kindName{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsa-provider{font-size:var(--dsa-fs-xs);color:var(--dsw-alias-label-tertiary);white-space:nowrap}',
      '.dsa-provider.hit{color:var(--dsw-alias-brand-primary)}',
      '.dsa-mapSeg{display:inline-flex;gap:2px;padding:3px;border-radius:8px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);margin:2px 0 10px}',
      '.dsa-mapSegBtn{border:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:var(--dsa-fs-sm);height:26px;padding:0 10px;border-radius:6px;cursor:pointer;white-space:nowrap}',
      '.dsa-mapSegBtn:hover{color:var(--dsw-alias-label-primary)}',
      '.dsa-mapSegBtn[aria-pressed="true"]{background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-bg-base);font-weight:600}',
      '.dsa-mapSegBtn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.dsa-searchRow{display:flex;align-items:center;gap:8px;margin-bottom:8px}',
      '.dsa-mapScroll{max-height:360px;overflow:auto;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1)}',
      '.dsa-mapTable{width:100%;min-width:560px;border-collapse:collapse;table-layout:auto;font-size:var(--dsa-fs-sm)}',
      '.dsa-mapTable th{position:sticky;top:0;z-index:1;background:var(--dsw-alias-bg-layer-2);text-align:left;font-size:var(--dsa-fs-xs);font-weight:600;color:var(--dsw-alias-label-tertiary);padding:6px 8px;border-bottom:1px solid var(--dsw-alias-border-l1);white-space:nowrap}',
      '.dsa-mapTable td{height:40px;padding:5px 8px;border-bottom:1px solid var(--dsw-alias-border-l1);vertical-align:middle;overflow:hidden;white-space:normal;word-break:break-word}',
      '.dsa-mapTable tbody tr:hover td{background:var(--dsw-alias-bg-layer-2)}',
      '.dsa-mapTable .dsa-kindDesc{white-space:normal;overflow:visible;text-overflow:clip;line-height:1.45}',
      '.dsa-colKindCell{width:176px;min-width:160px}',
      '.dsa-colRepIcon{width:62px;min-width:56px}',
      '.dsa-colSwitch{width:54px;min-width:50px}',
      '.dsa-colIconCell{width:46px}',
      '.dsa-colIconId{width:96px;min-width:86px}',
      '.dsa-colAction{width:118px;min-width:110px}',
      '.dsa-kindCell{display:flex;align-items:center;gap:8px;min-width:0}',
      '.dsa-colRules{width:250px;min-width:200px}',
      '.dsa-colExts{min-width:190px}',
      '.dsa-mapTable .dsa-kindDesc{white-space:normal;overflow:visible;text-overflow:clip;line-height:1.45;display:block}',
      '.dsa-mapTable .dsa-previewIcon{width:22px;height:22px}',
      '.dsa-mapTable .dsa-previewIcon svg{width:100%;height:100%}',
      '.dsa-mapCell{display:flex;flex-direction:column;gap:3px;min-width:0}',
      '.dsa-extChips{display:flex;flex-wrap:wrap;gap:4px}',
      '.dsa-specialLine{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10px;line-height:1.4;color:var(--dsw-alias-label-tertiary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsa-extChip{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10px;line-height:16px;padding:0 5px;border-radius:4px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);white-space:nowrap}',
      '.dsa-ftToolbar{display:flex;align-items:center;gap:8px;margin:2px 0 10px;flex-wrap:wrap}',
      '.dsa-ftSpacer{flex:1}',
      '.dsa-typeTable .dsa-colTypeIcon{width:48px}',
      '.dsa-typeTable .dsa-colTypeName{width:200px;min-width:170px}',
      '.dsa-typeTable .dsa-colTypeActions{width:214px;min-width:190px}',
      '.dsa-typeName{display:flex;align-items:center;gap:6px;font-weight:600;min-width:0}',
      '.dsa-typeTag{font-size:9.5px;line-height:15px;padding:0 5px;border-radius:4px;border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-tertiary);font-weight:400;white-space:nowrap}',
      '.dsa-purposeTag{display:inline-flex;align-items:center;height:19px;padding:0 6px;border-radius:4px;border:1px solid currentColor;font-size:10px;font-weight:600;white-space:nowrap}',
      '.dsa-purposeUntagged{border-color:var(--dsw-alias-border-l1);border-style:dashed;color:var(--dsw-alias-label-tertiary);background:transparent}',
      '.dsa-dirtyMark{margin-left:5px;font-size:10px;font-weight:800;color:#ffc45e}',
      '.dsa-versionDirty{box-shadow:0 0 0 1px #7a5a24 inset}',
      '.dsa-versionWorking{background:#2a2113;border:1px solid #7a5a24;color:#ffc45e;font-weight:600}',
      '.dsa-tagSelect{height:26px;max-width:160px;font-size:11px}',
      '.dsa-versionChip{display:inline-flex;align-items:center;gap:5px;height:18px;padding:0 7px;border-radius:999px;background:#16211a;border:1px solid #2f6b3f;color:#9bd6a8;font-family:ui-monospace,monospace;font-size:10px;font-weight:500;line-height:1;vertical-align:middle;margin-left:2px}',
      '.dsa-versionChip i{width:5px;height:5px;border-radius:50%;background:#7fbf8a}',
      '.dsa-versionChip.dsa-versionWarn{background:#241d12;border-color:#5a4a2a;color:#e0b15f}',
      '.dsa-versionChip.dsa-versionWarn i{background:#e0b15f}',
      '.dsa-git{display:flex;flex-direction:column;gap:2px;margin:10px 0;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:8px}',
      '.dsa-gitHead{font-size:11px;font-weight:600;color:var(--dsw-alias-label-secondary);margin-bottom:4px}',
      '.dsa-gitRow{display:grid;grid-template-columns:38px 62px minmax(0,1fr) auto;gap:8px;align-items:center;border:0;background:transparent;color:inherit;text-align:left;font:inherit;font-size:10.5px;padding:4px;border-radius:5px;cursor:pointer}',
      '.dsa-gitRow:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.dsa-gitV{font-family:ui-monospace,monospace;color:var(--dsw-alias-label-secondary)}',
      '.dsa-gitHash{font-family:ui-monospace,monospace;color:var(--dsw-alias-label-tertiary)}',
      '.dsa-gitSubject{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsa-gitTime{color:var(--dsw-alias-label-tertiary)}',
      '.dsa-members{display:flex;flex-direction:column;gap:4px;min-width:0}',
      '.dsa-chips{display:flex;flex-wrap:wrap;gap:4px}',
      '.dsa-chip{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10px;line-height:16px;padding:0 5px;border-radius:4px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);display:inline-flex;align-items:center;gap:3px;white-space:nowrap}',
      '.dsa-chipSpecial{color:var(--dsw-alias-state-info-primary,#7aa2ff);border-color:var(--dsw-alias-state-info-primary,#2f4468)}',
      '.dsa-chip button{border:0;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer;font-size:12px;line-height:1;padding:0 1px}',
      '.dsa-rowActions{display:flex;gap:6px}',
      '.dsa-danger{color:var(--dsw-alias-state-error-primary,#ff8f8f)}',
      '.dsa-primary{background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-bg-base);border-color:transparent;font-weight:600}',
      '.dsa-field{display:flex;flex-direction:column;gap:5px}',
      '.dsa-field + .dsa-field{margin-top:10px}',
      '.dsa-field label{font-size:var(--dsa-fs-xs);color:var(--dsw-alias-label-secondary)}',
      '.dsa-field .dsa-input{flex:0 0 auto;width:100%;height:30px}',
      '.dsa-chipsBox{display:flex;flex-wrap:wrap;gap:5px;min-height:34px;padding:5px 6px;border-radius:7px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);align-items:center}',
      '.dsa-chipsBox .dsa-chip{background:var(--dsw-alias-bg-layer-1)}',
      '.dsa-chipsBox input{flex:1;min-width:110px;border:0;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:var(--dsa-fs-sm);outline:0;padding:3px 2px}',
      '.dsa-set{display:flex;flex-direction:column;gap:8px;padding:4px 0 12px}',
      '.dsa-setTitle{margin:0;font-size:var(--dsa-fs);font-weight:600;color:var(--dsw-alias-label-primary)}',
      '.dsa-setHint{margin:0;font-size:var(--dsa-fs-sm);line-height:1.5;color:var(--dsw-alias-label-secondary)}',
      '.dsa-setRow{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);font-size:var(--dsa-fs);color:var(--dsw-alias-label-primary);cursor:pointer}',
      '.dsa-setRow:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.dsa-setRow input{accent-color:var(--dsw-alias-brand-primary);margin:0}',
      '.dsa-setSummary{font-size:var(--dsa-fs-sm);color:var(--dsw-alias-label-secondary)}',
      '.dsa-controls{position:sticky;top:0;z-index:4;background:var(--dsw-alias-bg-base);border-bottom:1px solid var(--dsw-alias-border-l1);padding-bottom:7px}',
      '.dsa-controlBar{display:flex;align-items:center;gap:8px;padding:0 16px}',
      '.dsa-seg{display:inline-flex;align-items:center;gap:2px;padding:2px;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;background:var(--dsw-alias-bg-layer-1)}',
      '.dsa-segLine{width:1px;height:18px;background:var(--dsw-alias-border-l2);flex:none}',
      '.dsa-iconSegBtn{width:30px;height:26px;border:0;border-radius:5px;background:transparent;color:var(--dsw-alias-label-secondary);display:grid;place-items:center;cursor:pointer;transition:background 150ms,color 150ms}',
      '.dsa-iconSegBtn:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.dsa-iconSegBtn[aria-pressed="true"]{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-base)}',
      '.dsa-iconSegBtn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.dsa-colBtn{width:30px;height:30px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);display:grid;place-items:center;cursor:pointer}',
      '.dsa-colBtn:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.dsa-colBtn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.dsa-viewBar{display:inline-flex;align-items:center;gap:2px;padding:2px;border-radius:7px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1)}',
      '.dsa-viewBtn{height:24px;padding:0 8px;border:0;border-radius:5px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:var(--dsa-fs-xs);cursor:pointer}',
      '.dsa-viewBtn:hover{color:var(--dsw-alias-label-primary)}',
      '.dsa-viewBtn[aria-pressed="true"]{background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-bg-base);font-weight:600}',
      '.dsa-viewBtn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.dsa-colMenuWrap{position:relative;margin-left:auto;display:flex;align-items:center}',
      '.dsa-colMenu{position:absolute;right:0;top:32px;width:232px;z-index:20;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;box-shadow:0 12px 32px color-mix(in srgb, var(--dsw-alias-label-primary) 18%, transparent);padding:6px}',
      '.dsa-colMenuTitle{font-size:var(--dsa-fs-xs);color:var(--dsw-alias-label-tertiary);padding:4px 6px 6px}',
      '.dsa-colMenuRow{display:flex;align-items:center;gap:2px;padding:3px 4px;border-radius:6px}',
      '.dsa-colMenuRow:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.dsa-colMenuRow label{display:flex;align-items:center;gap:6px;flex:1;font-size:var(--dsa-fs-sm);cursor:pointer;min-width:0}',
      '.dsa-colMove{width:22px;height:22px;border:0;border-radius:5px;background:transparent;color:var(--dsw-alias-label-tertiary);font-size:11px;cursor:pointer}',
      '.dsa-colMove:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.dsa-colMove:disabled{opacity:.35;cursor:default}',
      '.dsa-colReset{width:100%;margin-top:4px;text-align:left;border:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:var(--dsa-fs-sm);padding:6px;border-radius:6px;cursor:pointer}',
      '.dsa-colReset:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.dsa-dtable th{position:relative}',
      '.dsa-colResize{position:absolute;right:-3px;top:2px;bottom:2px;width:9px;cursor:col-resize;z-index:2}',
      '.dsa-colResize::after{content:"";position:absolute;left:4px;top:2px;bottom:2px;width:1px;background:var(--dsw-alias-border-l1)}',
      '.dsa-colResize:hover::after{background:var(--dsw-alias-brand-primary)}',
      '.dsa-fileTypeTag{display:inline-flex;align-items:center;gap:4px;height:19px;padding:0 6px;border-radius:5px;border:1px solid transparent;font-size:10.5px;line-height:1;font-weight:600;white-space:nowrap;max-width:100%}',
      '.dsa-fileTypeTag>span:last-child{overflow:hidden;text-overflow:ellipsis}',
      '.dsa-fileTypeIcon{width:12px;height:12px;display:inline-flex;flex:none}',
      '.dsa-fileTypeIcon svg{width:12px;height:12px;display:block}',
      '.dsa-fileTypeTagMuted{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-border-l1);color:var(--dsw-alias-label-tertiary);font-weight:500}',
      '.dsa-srcTag{display:inline-flex;align-items:center;height:18px;padding:0 6px;border-radius:4px;border:1px solid;font-size:10px;white-space:nowrap}',
      '.dsa-srcDelivered{color:var(--dsw-alias-state-info-primary,#8ab4ff);border-color:color-mix(in srgb, var(--dsw-alias-state-info-primary,#8ab4ff) 45%, transparent);background:color-mix(in srgb, var(--dsw-alias-state-info-primary,#8ab4ff) 12%, transparent)}',
      '.dsa-srcWritten{color:#b3a4ff;border-color:#3f3660;background:#211d33}',
      '.dsa-srcOther{color:var(--dsw-alias-label-secondary);border-color:var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2)}',
      '.dsa-srcScan{color:var(--dsw-alias-state-success-primary,#8fd6a0);border-color:color-mix(in srgb, var(--dsw-alias-state-success-primary,#8fd6a0) 45%, transparent);background:color-mix(in srgb, var(--dsw-alias-state-success-primary,#8fd6a0) 12%, transparent)}',
      '.dsa-dtable{width:100%;border-collapse:collapse;table-layout:fixed;font-size:var(--dsa-fs-sm)}',
      '.dsa-dtable th{position:sticky;top:36px;z-index:1;text-align:left;padding:6px 8px;border-bottom:1px solid var(--dsw-alias-border-l1);font-size:var(--dsa-fs-xs);font-weight:600;color:var(--dsw-alias-label-tertiary);background:var(--dsw-alias-bg-base);cursor:pointer;white-space:nowrap}',
      '.dsa-dtable th[aria-sort="ascending"],.dsa-dtable th[aria-sort="descending"]{color:var(--dsw-alias-label-secondary)}',
      '.dsa-dtable td{padding:9px 8px;border-bottom:1px solid var(--dsw-alias-border-l1);vertical-align:middle;overflow:hidden}',
      '.dsa-list[data-density="comfortable"] .dsa-listRow{min-height:36px;padding:7px 8px}',
      '.dsa-list[data-density="comfortable"] .dsa-contentRow{padding:12px 8px}',
      '.dsa-dtable tbody tr{cursor:pointer}',
      '.dsa-dtable tbody tr:hover{background:var(--dsw-alias-bg-layer-1)}',
      '.dsa-groupBy{display:flex;gap:2px;margin:0 12px 8px;padding:2px;width:max-content;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;background:var(--dsw-alias-bg-layer-1)}',
      '.dsa-groupByBtn{border:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:10.5px;padding:4px 9px;border-radius:5px;cursor:pointer}',
      '.dsa-groupByBtn[aria-pressed="true"]{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-layer-1);font-weight:650}',
      '.dsa-groupIcon{display:inline-flex;align-items:center;justify-content:center;margin-right:2px}',
      '.dsa-groupToggle{width:100%;border:0;background:var(--dsw-alias-bg-base);color:inherit;font:inherit;height:36px;padding:0 8px;align-items:center;cursor:pointer;text-align:left;line-height:1.4}',
      '.dsa-groupToggle[aria-expanded="false"]{height:36px;padding:0 8px}',
      '.dsa-groupToggle:hover{background:var(--dsw-alias-bg-layer-1)}',
      '.dsa-groupChevron{font-size:11px;color:var(--dsw-alias-label-tertiary);width:10px;flex:none}',
      '.dsa-kiconMaterial svg{display:block;width:100%;height:100%}',
      '.dsa-toneDot{width:20px;height:20px;border-radius:50%;border:2px solid transparent;cursor:pointer;padding:0}',
      '.dsa-toneDot.on{border-color:var(--dsw-alias-label-primary);box-shadow:0 0 0 2px var(--dsw-alias-bg-layer-1)}',
      '.dsa-selected{background:var(--dsw-alias-bg-layer-2)!important;box-shadow:inset 2px 0 0 var(--dsw-alias-brand-primary)}',
      '.dsa-listRow.dsa-selected,.dsa-tile.dsa-selected,.dsa-iconCell.dsa-selected,.dsa-contentRow.dsa-selected{border-color:var(--dsw-alias-brand-primary)}',
      '.dsa-menu{position:fixed;z-index:90;min-width:190px;padding:4px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);box-shadow:0 16px 40px rgba(0,0,0,.45)}',
      '.dsa-menu button{display:flex;width:100%;border:0;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:11.5px;text-align:left;padding:7px 9px;border-radius:6px;cursor:pointer}',
      '.dsa-menu button:hover,.dsa-menu button:focus{background:var(--dsw-alias-bg-layer-1);outline:none}',
      '.dsa-dtable tbody tr:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}',
      '.dsa-colKind{width:86px}',
      '.dsa-colTime{width:118px}',
      '.dsa-colSource{width:58px}',
      '.dsa-cellName{display:flex;align-items:flex-start;gap:8px;min-width:0}',
      '.dsa-cellName svg{flex:none;color:var(--dsw-alias-label-secondary);margin-top:1px}',
      '.dsa-cellText{display:flex;flex-direction:column;gap:1px;min-width:0;flex:1}',
      '.dsa-muted{color:var(--dsw-alias-label-tertiary);font-size:var(--dsa-fs-xs)}',
      '.dsa-version{display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:5px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;font-weight:700;line-height:1;white-space:nowrap;background:#182433;border:1px solid #35557a;color:#9fc3ff}',
      '.dsa-versionLoading{width:42px;justify-content:center;background:#22262c;border-color:#3a4048}',
      '.dsa-versionSpinner{width:10px;height:10px;border:1.5px solid #55555f;border-top-color:#c7c7cf;border-radius:50%;animation:dsa-spin .7s linear infinite}',
      '.dsa-versionRetry{display:inline-flex;align-items:center;justify-content:center;height:22px;min-width:30px;padding:0 7px;border-radius:5px;background:#2b1d1d;border:1px solid #5a3a3a;color:#b39191;font:700 11px ui-monospace,monospace;cursor:pointer}',
      '.dsa-versionRetry:hover{background:#3a2525;color:#e0b0b0}',
      '.dsa-versionRetry:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '@keyframes dsa-spin{to{transform:rotate(360deg)}}',
      '.dsa-src{font-size:10px;padding:1px 5px;border-radius:4px;border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);white-space:nowrap}',
      '.dsa-listRows{display:flex;flex-direction:column;padding:2px 0}',
      '.dsa-listRow{display:flex;align-items:center;gap:9px;min-height:32px;padding:4px 8px;border:0;border-radius:6px;background:transparent;color:inherit;font:inherit;text-align:left;width:100%;cursor:pointer}',
      '.dsa-listRow:hover{background:var(--dsw-alias-bg-layer-1)}',
      '.dsa-listRow:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.dsa-listRow svg{flex:none;color:var(--dsw-alias-label-secondary)}',
      '.dsa-listPath{margin-left:auto;font-size:var(--dsa-fs-xs);color:var(--dsw-alias-label-tertiary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:45%}',
      '.dsa-tileGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;padding:6px 4px}',
      '.dsa-tile{display:flex;flex-direction:column;gap:6px;min-height:104px;padding:10px;border-radius:8px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);color:inherit;font:inherit;text-align:left;cursor:pointer}',
      '.dsa-tile:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.dsa-tile:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.dsa-tileIcon{display:inline-flex;color:var(--dsw-alias-label-secondary)}',
      '.dsa-marqueeName{display:block;min-width:0;max-width:100%;overflow:hidden}',
      '.dsa-marqueeInner{display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsa-marqueeName.dsa-iconName{display:flex;align-items:center;justify-content:center;height:2.8em;width:100%}',
      '.dsa-marqueeName.dsa-iconName .dsa-marqueeInner{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;white-space:normal;text-overflow:clip;word-break:break-all;text-align:center;line-height:1.4}',
      '.dsa-marqueeMeasure .dsa-marqueeInner,.dsa-marqueeOn .dsa-marqueeInner{display:inline-block;max-width:none;overflow:visible;white-space:nowrap;text-overflow:clip;-webkit-line-clamp:unset;word-break:normal}',
      '.dsa-marqueeOn .dsa-marqueeInner{animation:dsa-name-marquee var(--dsa-dur,2s) ease-in-out infinite alternate}',
      '@keyframes dsa-name-marquee{0%,12%{transform:translateX(0)}88%,100%{transform:translateX(var(--dsa-shift,-20px))}}',
      '@media (prefers-reduced-motion: reduce){.dsa-marqueeOn .dsa-marqueeInner{animation:none;transform:none}}',
      '.dsa-tileName{font-size:var(--dsa-fs);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsa-tileDesc{font-size:var(--dsa-fs-sm);color:var(--dsw-alias-label-secondary);line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
      '.dsa-tileMeta{margin-top:auto;font-size:var(--dsa-fs-xs);color:var(--dsw-alias-label-tertiary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsa-iconGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:4px;padding:6px 4px}',
      '.dsa-list .dsa-iconGrid{max-height:none;overflow:visible;margin-top:0}',
      '.dsa-iconCell{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 6px 10px;border:1px solid transparent;border-radius:8px;background:transparent;color:inherit;font:inherit;cursor:pointer;text-align:center}',
      '.dsa-iconCell:hover{background:var(--dsw-alias-bg-layer-1);border-color:var(--dsw-alias-border-l1)}',
      '.dsa-iconCell:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.dsa-iconCell svg{color:var(--dsw-alias-label-secondary)}',
      '.dsa-iconName{font-size:var(--dsa-fs-sm);line-height:1.4;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-all;max-width:100%}',
      '.dsa-iconPath{font-size:10px;color:var(--dsw-alias-label-tertiary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}',
      '.dsa-contentList{display:flex;flex-direction:column;padding:2px 0}',
      '.dsa-contentRow{display:flex;gap:10px;align-items:flex-start;width:100%;padding:10px 8px;border:0;border-bottom:1px solid var(--dsw-alias-border-l1);border-radius:6px;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}',
      '.dsa-contentRow:hover{background:var(--dsw-alias-bg-layer-1)}',
      '.dsa-contentRow:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}',
      '.dsa-contentRow > svg{flex:none;color:var(--dsw-alias-label-secondary);margin-top:2px}',
      '.dsa-contentBody{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}',
      '.dsa-contentName{font-size:var(--dsa-fs);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsa-contentDesc{font-size:var(--dsa-fs-sm);color:var(--dsw-alias-label-secondary);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
      '.dsa-contentMeta{flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:var(--dsa-fs-xs);color:var(--dsw-alias-label-tertiary);padding-top:1px;white-space:nowrap}',
      '.dsa-viewSelect{height:28px;flex:1 1 160px;max-width:220px}',
      '.dsa-kindGroup{display:flex;flex-direction:column;gap:4px;margin-top:10px}',
      '.dsa-kindGroupTitle{margin:0 0 2px;font-size:var(--dsa-fs-sm);font-weight:600;color:var(--dsw-alias-label-secondary)}',
      '.dsa-kindRow{display:flex;align-items:center;gap:10px;min-height:44px;padding:6px 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}',
      '.dsa-kindIcon{display:inline-flex;align-items:center;justify-content:center;width:20px;flex:none;color:var(--dsw-alias-label-secondary)}',
      '.dsa-kindText{display:flex;flex-direction:column;gap:2px;flex:1 1 auto;min-width:0}',
      '.dsa-kindName{font-size:var(--dsa-fs);line-height:1.35;color:var(--dsw-alias-label-primary)}',
      '.dsa-kindDesc{font-size:var(--dsa-fs-sm);line-height:1.4;color:var(--dsw-alias-label-tertiary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsa-switch{position:relative;display:inline-flex;flex:none;width:36px;height:20px}',
      '.dsa-switch input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;appearance:none;-webkit-appearance:none;border:0;background:transparent}',
      '.dsa-switch i{position:absolute;inset:0;border-radius:999px;background:var(--dsw-alias-bg-layer-3);box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l1);transition:background 150ms}',
      '.dsa-switch i::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:var(--dsw-alias-label-tertiary);transition:transform 150ms,background 150ms}',
      '.dsa-switch input:checked + i{background:var(--dsw-alias-brand-primary);box-shadow:none}',
      '.dsa-switch input:checked + i::after{transform:translateX(16px);background:var(--dsw-alias-bg-base)}',
      '.dsa-switch input:focus-visible + i{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}',
      '@media (prefers-reduced-motion:reduce){.dsa-switch i,.dsa-switch i::after{transition:none}}',
      '.dsa-tag{font-size:10px;line-height:16px;padding:0 5px;border-radius:4px;border:1px solid var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}',
      '.dsa-cat{font-size:10px}',
      '.dsa-scopeHint{display:flex;align-items:center;gap:8px;padding:8px 16px;font-size:var(--dsa-fs-xs);color:var(--dsw-alias-label-tertiary);border-top:1px solid var(--dsw-alias-border-l1)}',
      '.dsa-scopeHint .dsa-button{margin-left:auto}',
      '.dsa-empty{padding:40px 16px;text-align:center;color:var(--dsw-alias-label-secondary);font-size:var(--dsa-fs-sm)}',
      '.dsa-more{display:flex;justify-content:center;padding:12px}',
      '.dsa-overlay{position:fixed;inset:0;background:rgba(0,0,0,.46);display:flex;align-items:center;justify-content:center;z-index:60}',
      '.dsa-modal{width:min(760px,92vw);max-height:82vh;display:flex;flex-direction:column;border-radius:14px;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1);box-shadow:0 12px 40px color-mix(in srgb, var(--dsw-alias-label-primary) 24%, transparent)}',
      '.dsa-modalHead{display:flex;align-items:flex-start;gap:10px;padding:16px 18px 10px}',
      '.dsa-modalTitle{margin:0;font-size:var(--dsa-fs-lg);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsa-modalPath{font-size:var(--dsa-fs-xs);color:var(--dsw-alias-label-secondary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsa-modalActions{display:flex;flex-wrap:wrap;gap:8px;padding:0 18px 10px}',
      '.dsa-modalBody{flex:1 1 auto;min-height:0;overflow:auto;padding:0 18px 18px}',
      '.dsa-kv{display:grid;grid-template-columns:96px 1fr;gap:4px 12px;font-size:var(--dsa-fs-sm);margin:6px 0 12px}',
      '.dsa-kv dt{color:var(--dsw-alias-label-secondary)}',
      '.dsa-kv dd{margin:0;overflow-wrap:anywhere}',
      '.dsa-pre{margin:0;padding:12px;border-radius:10px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);font-size:var(--dsa-fs-sm);line-height:1.5;white-space:pre-wrap;word-break:break-word;max-height:46vh;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}',
      '.dsa-img{max-width:100%;max-height:46vh;display:block;margin:0 auto;border-radius:10px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}',
      '.dsa-note{font-size:var(--dsa-fs-sm);color:var(--dsw-alias-label-secondary);margin-top:8px}',
      '.dsa-reader{flex:1 1 auto;min-height:0;height:100%;overflow:auto;background:var(--dsw-alias-bg-base)}',
      '.dsa-readerInner{max-width:820px;margin:0 auto;padding:28px 32px 64px;font-size:var(--dsa-fs-lg);line-height:1.75;color:var(--dsw-alias-label-primary)}',
      '.dsa-readerPath{margin:0 0 20px;font-size:var(--dsa-fs-xs);color:var(--dsw-alias-label-secondary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;overflow-wrap:anywhere}',
      '.dsa-readerNote{margin:12px 0;font-size:var(--dsa-fs-sm);color:var(--dsw-alias-label-secondary)}',
      '.dsa-readerError{margin-top:6px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;overflow-wrap:anywhere}',
      '.dsa-markdown h1,.dsa-markdown h2,.dsa-markdown h3,.dsa-markdown h4{margin:1.6em 0 .6em;line-height:1.3;font-weight:650}',
      '.dsa-markdown h1{font-size:1.7em}',
      '.dsa-markdown h2{font-size:1.35em;padding-bottom:.3em;border-bottom:1px solid var(--dsw-alias-border-l1)}',
      '.dsa-markdown h3{font-size:1.15em}',
      '.dsa-markdown p{margin:.9em 0}',
      '.dsa-markdown ul,.dsa-markdown ol{margin:.8em 0;padding-left:1.5em}',
      '.dsa-markdown li{margin:.25em 0}',
      '.dsa-markdown blockquote{margin:1em 0;padding:.4em 0 .4em 1em;border-left:2px solid var(--dsw-alias-border-l3);color:var(--dsw-alias-label-secondary)}',
      '.dsa-markdown blockquote p{margin:.3em 0}',
      '.dsa-markdown code{font-size:.92em;padding:.12em .32em;border-radius:4px;background:var(--dsw-alias-bg-layer-1);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}',
      '.dsa-markdown .dsa-md-code{margin:1em 0;padding:12px 14px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);overflow:auto}',
      '.dsa-markdown .dsa-md-code code{padding:0;background:none;font-size:var(--dsa-fs-sm);line-height:1.6}',
      '.dsa-markdown table{margin:1em 0;border-collapse:collapse;width:100%;font-size:var(--dsa-fs)}',
      '.dsa-markdown th,.dsa-markdown td{border:1px solid var(--dsw-alias-border-l1);padding:6px 10px;text-align:left;vertical-align:top}',
      '.dsa-markdown th{background:var(--dsw-alias-bg-layer-1);font-weight:600}',
      '.dsa-markdown img{max-width:100%;border-radius:8px}',
      '.dsa-markdown a{color:var(--dsw-alias-brand-primary);text-decoration:none}',
      '.dsa-markdown a:hover{text-decoration:underline}',
      '.dsa-markdown hr{margin:1.6em 0;border:0;border-top:1px solid var(--dsw-alias-border-l1)}',
      '.dsa-toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);padding:8px 14px;border-radius:10px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);font-size:var(--dsa-fs-sm);z-index:80}',
      '.dsa-loading{padding:24px;text-align:center;font-size:var(--dsa-fs-sm);color:var(--dsw-alias-label-secondary)}',
      '.dsa-tail{display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-size:var(--dsa-fs-sm);color:var(--dsw-alias-label-secondary);padding:6px 2px}',
      '.dsa-tailHead{font-weight:500;color:var(--dsw-alias-label-secondary)}',
      '.dsa-tailChip{display:inline-flex;align-items:center;gap:6px;max-width:240px;padding:2px 8px;border-radius:6px;border:1px solid var(--dsw-alias-border-l1);background:transparent;color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer}',
      '.dsa-tailChip:hover{background:var(--dsw-alias-bg-layer-1)}',
      '.dsa-tailChip:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.dsa-tailName{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsa-tailDot{flex:none;font-size:9px;font-weight:600;color:var(--dsw-alias-label-secondary)}',
      '.dsa-error{padding:24px;text-align:center;font-size:var(--dsa-fs-sm);color:var(--dsw-alias-state-error-primary)}',
      '@media (prefers-reduced-motion: reduce){.dsa-page *{transition:none!important;animation:none!important}}',
    ].join('\n');

    // DSH 右侧栏「开始」导览页（@deepseek-ai/dsh-client-ui-sidebar-right 的 CSS module
    // p2k40q_*）。原生布局：垂直居中 + 无滚动，条目一多就被裁掉；这里改为顶部对齐、
    // 紧凑行高并允许滚动。类名改动时本段自动失效，不影响功能。
    const GUIDE_CSS = [
      '.p2k40q_guide{box-sizing:border-box;height:100%;min-height:0;overflow-y:auto;justify-content:safe center;scroll-padding-top:40px;padding:40px 24px 24px}',
    ].join('\n');

    function injectGuideStyles() {
      if (typeof document === 'undefined' || document.getElementById('dsh-agent-artifacts-guide') !== null) return;
      // 默认不注入：样式统一交给 dsh-better-sidebar 的「自定义 CSS」。
      // 需要插件自带样式时设 localStorage: dsh-agent-artifacts-guide-css = "on"。
      try {
        if (!(globalThis.localStorage && localStorage.getItem('dsh-agent-artifacts-guide-css') === 'on')) return;
      } catch {
        return;
      }
      const style = document.createElement('style');
      style.id = 'dsh-agent-artifacts-guide';
      style.textContent = GUIDE_CSS;
      (document.head || document.documentElement).appendChild(style);
    }

    function StyleSheet() {
      return h('style', { 'data-dsh-agent-artifacts': '1' }, CSS);
    }

    injectGuideStyles();

    function Icon({ size = 22, active = false }) {
      return h('svg', {
        width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round',
        'aria-hidden': 'true', focusable: 'false', style: { opacity: active ? 1 : 0.82, display: 'block' },
      },
        h('path', { d: 'M3 7.5 12 3l9 4.5-9 4.5-9-4.5Z' }),
        h('path', { d: 'm3 12.5 9 4.5 9-4.5' }),
        h('path', { d: 'm3 17 9 4.5 9-4.5' }));
    }

    // #region file-icons
    const FILE_ICONS = {
      "audio": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#ef5350\" d=\"M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m6 10h-4v8a4 4 0 1 1-4-4 3.96 3.96 0 0 1 2 .555V8h6Z\"/></svg>",
      "c": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#0288d1\" d=\"M19.563 22A5.57 5.57 0 0 1 14 16.437v-2.873A5.57 5.57 0 0 1 19.563 8H24V2h-4.437A11.563 11.563 0 0 0 8 13.563v2.873A11.564 11.564 0 0 0 19.563 28H24v-6Z\"/></svg>",
      "console": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill=\"#ff7043\" d=\"M2 2a1 1 0 0 0-1 1v10c0 .554.446 1 1 1h12c.554 0 1-.446 1-1V3a1 1 0 0 0-1-1zm0 3h12v8H2zm1 2 2 2-2 2 1 1 3-3-3-3zm5 3.5V12h5v-1.5z\"/></svg>",
      "cpp": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#0288d1\" d=\"M28 14v-4h-2v4h-6v-4h-2v4h-4v2h4v4h2v-4h6v4h2v-4h4v-2z\"/><path fill=\"#0288d1\" d=\"M13.563 22A5.57 5.57 0 0 1 8 16.437v-2.873A5.57 5.57 0 0 1 13.563 8H18V2h-4.437A11.563 11.563 0 0 0 2 13.563v2.873A11.564 11.564 0 0 0 13.563 28H18v-6Z\"/></svg>",
      "css": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#7e57c2\" d=\"M20 18h-2v-2h-2v2c0 .193 0 .703 1.254 1.033A3.345 3.345 0 0 1 20 22h2v2h2v-2c0-.388-.562-.851-1.254-1.034C20.356 20.34 20 18.84 20 18m-3.254 2.966C14.356 20.34 14 18.84 14 18h-2v-2h-2v8h2v-2h4v2h2v-2c0-.388-.562-.851-1.254-1.034\"/><path fill=\"#7e57c2\" d=\"M24 4H4v20a4 4 0 0 0 4 4h16.16A3.84 3.84 0 0 0 28 24.16V8a4 4 0 0 0-4-4m2 14h-2v-2h-2v2c0 .193 0 .703 1.254 1.033A3.345 3.345 0 0 1 26 22v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2 2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2 2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 2 2 0 0 1 2-2h2a2 2 0 0 1 2 2Z\"/></svg>",
      "database": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#ffca28\" d=\"M16 24c-5.525 0-10-.9-10-2v4c0 1.1 4.475 2 10 2s10-.9 10-2v-4c0 1.1-4.475 2-10 2m0-8c-5.525 0-10-.9-10-2v4c0 1.1 4.475 2 10 2s10-.9 10-2v-4c0 1.1-4.475 2-10 2m0-12C10.477 4 6 4.895 6 6v4c0 1.1 4.475 2 10 2s10-.9 10-2V6c0-1.105-4.477-2-10-2\"/></svg>",
      "diff": "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\"><path d=\"M0 0h24v24H0z\"/><path fill=\"#42a5f5\" d=\"M18 23H4c-1.1 0-2-.9-2-2V7h2v14h14zM14.5 7V5h-2v2h-2v2h2v2h2V9h2V7zm2 6h-6v2h6zM15 1H8c-1.1 0-1.99.9-1.99 2L6 17c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V7zm4 16H8V3h6.17L19 7.83z\"/></svg>",
      "docker": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"#0288d1\" d=\"M21.81 10.25c-.06-.04-.56-.43-1.64-.43-.28 0-.56.03-.84.08-.21-1.4-1.38-2.11-1.43-2.14l-.29-.17-.18.27c-.24.36-.43.77-.51 1.19-.2.8-.08 1.56.33 2.21-.49.28-1.29.35-1.46.35H2.62c-.34 0-.62.28-.62.63 0 1.15.18 2.3.58 3.38.45 1.19 1.13 2.07 2 2.61.98.6 2.59.94 4.42.94.79 0 1.61-.07 2.42-.22 1.12-.2 2.2-.59 3.19-1.16A8.3 8.3 0 0 0 16.78 16c1.05-1.17 1.67-2.5 2.12-3.65h.19c1.14 0 1.85-.46 2.24-.85.26-.24.45-.53.59-.87l.08-.24zm-17.96.99h1.76c.08 0 .16-.07.16-.16V9.5c0-.08-.07-.16-.16-.16H3.85c-.09 0-.16.07-.16.16v1.58c.01.09.07.16.16.16m2.43 0h1.76c.08 0 .16-.07.16-.16V9.5c0-.08-.07-.16-.16-.16H6.28c-.09 0-.16.07-.16.16v1.58c.01.09.07.16.16.16m2.47 0h1.75c.1 0 .17-.07.17-.16V9.5c0-.08-.06-.16-.17-.16H8.75c-.08 0-.15.07-.15.16v1.58c0 .09.06.16.15.16m2.44 0h1.77c.08 0 .15-.07.15-.16V9.5c0-.08-.06-.16-.15-.16h-1.77c-.08 0-.15.07-.15.16v1.58c0 .09.07.16.15.16M6.28 9h1.76c.08 0 .16-.09.16-.18V7.25c0-.09-.07-.16-.16-.16H6.28c-.09 0-.16.06-.16.16v1.57c.01.09.07.18.16.18m2.47 0h1.75c.1 0 .17-.09.17-.18V7.25c0-.09-.06-.16-.17-.16H8.75c-.08 0-.15.06-.15.16v1.57c0 .09.06.18.15.18m2.44 0h1.77c.08 0 .15-.09.15-.18V7.25c0-.09-.07-.16-.15-.16h-1.77c-.08 0-.15.06-.15.16v1.57c0 .09.07.18.15.18m0-2.28h1.77c.08 0 .15-.07.15-.16V5c0-.1-.07-.17-.15-.17h-1.77c-.08 0-.15.06-.15.17v1.56c0 .08.07.16.15.16m2.46 4.52h1.76c.09 0 .16-.07.16-.16V9.5c0-.08-.07-.16-.16-.16h-1.76c-.08 0-.15.07-.15.16v1.58c0 .09.07.16.15.16\"/></svg>",
      "document": "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\"><path d=\"M0 0h24v24H0z\"/><path fill=\"#42a5f5\" d=\"M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm4 18H6V4h7v5h5z\"/></svg>",
      "drawio": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#fb8c00\" d=\"m25.329 20-7.001-8H20V4h-8v8h1.672l-7.001 8H4v8h8v-8H9.328L16 12.376 22.672 20H20v8h8v-8z\"/></svg>",
      "font": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#f44336\" d=\"M24 28h4L18 4h-4L4 28h4l8-19.422\"/><path fill=\"#f44336\" d=\"M8 20h16v4H8z\"/></svg>",
      "git": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#e64a19\" d=\"M13.172 2.828 11.78 4.22l1.91 1.91 2 2A2.986 2.986 0 0 1 20 10.81a3.25 3.25 0 0 1-.31 1.31l2.06 2a2.68 2.68 0 0 1 3.37.57 2.86 2.86 0 0 1 .88 2.117 3.02 3.02 0 0 1-.856 2.109A2.9 2.9 0 0 1 23 19.81a2.93 2.93 0 0 1-2.13-.87 2.694 2.694 0 0 1-.56-3.38l-2-2.06a3 3 0 0 1-.31.12V20a3 3 0 0 1 1.44 1.09 2.92 2.92 0 0 1 .56 1.72 2.88 2.88 0 0 1-.878 2.128 2.98 2.98 0 0 1-2.048.871 2.981 2.981 0 0 1-2.514-4.719A3 3 0 0 1 16 20v-6.38a2.96 2.96 0 0 1-1.44-1.09 2.9 2.9 0 0 1-.56-1.72 2.9 2.9 0 0 1 .31-1.31l-3.9-3.9-7.579 7.572a4 4 0 0 0-.001 5.658l10.342 10.342a4 4 0 0 0 5.656 0l10.344-10.344a4 4 0 0 0 0-5.656L18.828 2.828a4 4 0 0 0-5.656 0\"/></svg>",
      "go": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#00acc1\" d=\"M2 12h4v2H2zm-2 4h6v2H0zm4 4h2v2H4zm16.954-5H14v3h3.239a4.42 4.42 0 0 1-3.531 2 2.65 2.65 0 0 1-2.053-.858 2.86 2.86 0 0 1-.628-2.28A4.515 4.515 0 0 1 15.292 13a2.73 2.73 0 0 1 1.749.584l2.962-1.185A5.6 5.6 0 0 0 15.292 10a7.526 7.526 0 0 0-7.243 6.5 5.614 5.614 0 0 0 5.659 6.5 7.526 7.526 0 0 0 7.243-6.5 6.4 6.4 0 0 0 .003-1.5\"/><path fill=\"#00acc1\" d=\"M26.292 10a7.526 7.526 0 0 0-7.243 6.5 5.614 5.614 0 0 0 5.659 6.5 7.526 7.526 0 0 0 7.243-6.5 5.614 5.614 0 0 0-5.659-6.5m2.681 6.137A4.515 4.515 0 0 1 24.708 20a2.65 2.65 0 0 1-2.053-.858 2.86 2.86 0 0 1-.628-2.28A4.515 4.515 0 0 1 26.292 13a2.65 2.65 0 0 1 2.053.858 2.86 2.86 0 0 1 .628 2.28Z\"/></svg>",
      "html": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#e65100\" d=\"m4 4 2 22 10 2 10-2 2-22Zm19.72 7H11.28l.29 3h11.86l-.802 9.335L15.99 25l-6.635-1.646L8.93 19h3.02l.19 2 3.86.77 3.84-.77.29-4H8.84L8 8h16Z\"/></svg>",
      "image": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill=\"#26a69a\" d=\"M8.5 6h4l-4-4zM3.875 1H9.5l4 4v8.6c0 .773-.616 1.4-1.375 1.4h-8.25c-.76 0-1.375-.627-1.375-1.4V2.4c0-.777.612-1.4 1.375-1.4M4 13.6h8V8l-2.625 2.8L8 9.4zm1.25-7.7c-.76 0-1.375.627-1.375 1.4s.616 1.4 1.375 1.4c.76 0 1.375-.627 1.375-1.4S6.009 5.9 5.25 5.9\"/></svg>",
      "java": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#f44336\" d=\"M4 26h24v2H4zM28 4H7a1 1 0 0 0-1 1v13a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-4h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 8h-4V6h4Z\"/></svg>",
      "javascript": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill=\"#ffca28\" d=\"M2 2v12h12V2zm6 6h1v4a1.003 1.003 0 0 1-1 1H7a1.003 1.003 0 0 1-1-1v-1h1v1h1zm3 0h2v1h-2v1h1a1.003 1.003 0 0 1 1 1v1a1.003 1.003 0 0 1-1 1h-2v-1h2v-1h-1a1.003 1.003 0 0 1-1-1V9a1.003 1.003 0 0 1 1-1\"/></svg>",
      "json": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path fill=\"#f9a825\" d=\"M560-160v-80h120q17 0 28.5-11.5T720-280v-80q0-38 22-69t58-44v-14q-36-13-58-44t-22-69v-80q0-17-11.5-28.5T680-720H560v-80h120q50 0 85 35t35 85v80q0 17 11.5 28.5T840-560h40v160h-40q-17 0-28.5 11.5T800-360v80q0 50-35 85t-85 35zm-280 0q-50 0-85-35t-35-85v-80q0-17-11.5-28.5T120-400H80v-160h40q17 0 28.5-11.5T160-600v-80q0-50 35-85t85-35h120v80H280q-17 0-28.5 11.5T240-680v80q0 38-22 69t-58 44v14q36 13 58 44t22 69v80q0 17 11.5 28.5T280-240h120v80z\"/></svg>",
      "less": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"#0277bd\" d=\"M8 3a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2H3v2h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2v-2H8v-5a2 2 0 0 0-2-2 2 2 0 0 0 2-2V5h2V3m6 0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5h-2V3z\"/></svg>",
      "license": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill=\"#ff5722\" d=\"M8 1a5.5 5.5 0 0 0-4 9.26V15l4-1.5 4 1.5v-4.74A5.49 5.49 0 0 0 8 1m0 1.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8m0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4\"/></svg>",
      "lock": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#ffd54f\" d=\"M25 12h-3V8a6 6 0 0 0-12 0v4H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V13a1 1 0 0 0-1-1M14 8a2 2 0 0 1 4 0v4h-4Zm2 17a4 4 0 1 1 4-4 4 4 0 0 1-4 4\"/></svg>",
      "lua": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#42a5f5\" d=\"M30 6a3.86 3.86 0 0 1-1.167 2.833 4.024 4.024 0 0 1-5.666 0A3.86 3.86 0 0 1 22 6a3.86 3.86 0 0 1 1.167-2.833 4.024 4.024 0 0 1 5.666 0A3.86 3.86 0 0 1 30 6m-9.208 5.208A10.6 10.6 0 0 0 13 8a10.6 10.6 0 0 0-7.792 3.208A10.6 10.6 0 0 0 2 19a10.6 10.6 0 0 0 3.208 7.792A10.6 10.6 0 0 0 13 30a10.6 10.6 0 0 0 7.792-3.208A10.6 10.6 0 0 0 24 19a10.6 10.6 0 0 0-3.208-7.792m-1.959 7.625a4.024 4.024 0 0 1-5.666 0 4.024 4.024 0 0 1 0-5.666 4.024 4.024 0 0 1 5.666 0 4.024 4.024 0 0 1 0 5.666\"/></svg>",
      "makefile": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#ef5350\" d=\"m29.5 24.02-1.6-.92a4.4 4.4 0 0 0 .09-.9A1.3 1.3 0 0 0 28 22a5.6 5.6 0 0 0-.1-1.1l1.6-.92a.493.493 0 0 0 .18-.68l-1.5-2.6a.45.45 0 0 0-.18-.18V6.01a2.006 2.006 0 0 0-2-2H4a2.006 2.006 0 0 0-2 2V22a2.006 2.006 0 0 0 2 2h10.53l-.03.02a.493.493 0 0 0-.18.68l1.5 2.6a.493.493 0 0 0 .68.18l1.6-.92a5.9 5.9 0 0 0 1.9 1.09v1.85a.495.495 0 0 0 .5.5h3a.495.495 0 0 0 .5-.5v-1.85a5.9 5.9 0 0 0 1.9-1.09l1.6.92a.493.493 0 0 0 .68-.18l1.5-2.6a.493.493 0 0 0-.18-.68M24 22.01a1.99 1.99 0 0 1-.88 1.65l-.18.11a2.04 2.04 0 0 1-1.88 0l-.18-.11a1.99 1.99 0 0 1-.88-1.65V22a2 2 0 0 1 .88-1.66l.18-.11a2.04 2.04 0 0 1 1.88 0l.18.11A2 2 0 0 1 24 22Zm2-4.63-.1.06a5.9 5.9 0 0 0-1.9-1.09V14.5a.495.495 0 0 0-.5-.5h-3a.495.495 0 0 0-.5.5v1.85a5.9 5.9 0 0 0-1.9 1.09l-1.6-.92a.493.493 0 0 0-.68.18l-1.5 2.6a.493.493 0 0 0 .18.68l1.6.92A5.6 5.6 0 0 0 16 22v.01L4 22V10.01h22Z\"/></svg>",
      "markdown": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#42a5f5\" d=\"m14 10-4 3.5L6 10H4v12h4v-6l2 2 2-2v6h4V10zm12 6v-6h-4v6h-4l6 8 6-8z\"/></svg>",
      "mermaid": "<svg xmlns=\"http://www.w3.org/2000/svg\" stroke-linejoin=\"round\" stroke-miterlimit=\"2\" clip-rule=\"evenodd\" viewBox=\"0 0 64 64\"><path fill=\"#ff4081\" d=\"M56.954 11.425C45.907 10.952 35.763 17.749 32 28.146 28.236 17.749 18.093 10.952 7.046 11.425a25.46 25.46 0 0 0 11.073 22.072 13.66 13.66 0 0 1 5.92 11.286v7.815h15.924v-7.815a13.66 13.66 0 0 1 5.92-11.286 25.44 25.44 0 0 0 11.072-22.072z\"/></svg>",
      "nodejs": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#8bc34a\" d=\"M16 20.003v2h4a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2v-2h4v-2h-4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v2Z\"/><path fill=\"#8bc34a\" d=\"m16 3.003-12 7v14l4 2h6v-13.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v11.5H8l-2-1.034V11.15l10-5.833 10 5.833v11.703l-10 5.833-1.745-1.022L13 29.253l3 1.75 12-7v-14Z\"/></svg>",
      "pdf": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"#ef5350\" d=\"M13 9h5.5L13 3.5zM6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m4.93 10.44c.41.9.93 1.64 1.53 2.15l.41.32c-.87.16-2.07.44-3.34.93l-.11.04.5-1.04c.45-.87.78-1.66 1.01-2.4m6.48 3.81c.18-.18.27-.41.28-.66.03-.2-.02-.39-.12-.55-.29-.47-1.04-.69-2.28-.69l-1.29.07-.87-.58c-.63-.52-1.2-1.43-1.6-2.56l.04-.14c.33-1.33.64-2.94-.02-3.6a.85.85 0 0 0-.61-.24h-.24c-.37 0-.7.39-.79.77-.37 1.33-.15 2.06.22 3.27v.01c-.25.88-.57 1.9-1.08 2.93l-.96 1.8-.89.49c-1.2.75-1.77 1.59-1.88 2.12-.04.19-.02.36.05.54l.03.05.48.31.44.11c.81 0 1.73-.95 2.97-3.07l.18-.07c1.03-.33 2.31-.56 4.03-.75 1.03.51 2.24.74 3 .74.44 0 .74-.11.91-.3m-.41-.71.09.11c-.01.1-.04.11-.09.13h-.04l-.19.02c-.46 0-1.17-.19-1.9-.51.09-.1.13-.1.23-.1 1.4 0 1.8.25 1.9.35M7.83 17c-.65 1.19-1.24 1.85-1.69 2 .05-.38.5-1.04 1.21-1.69zm3.02-6.91c-.23-.9-.24-1.63-.07-2.05l.07-.12.15.05c.17.24.19.56.09 1.1l-.03.16-.16.82z\"/></svg>",
      "php": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"#1e88e5\" d=\"M12 18.08c-6.63 0-12-2.72-12-6.08s5.37-6.08 12-6.08S24 8.64 24 12s-5.37 6.08-12 6.08m-5.19-7.95c.54 0 .91.1 1.09.31.18.2.22.56.13 1.03-.1.53-.29.87-.58 1.09q-.42.33-1.29.33h-.87l.53-2.76zm-3.5 5.55h1.44l.34-1.75h1.23c.54 0 .98-.06 1.33-.17.35-.12.67-.31.96-.58.24-.22.43-.46.58-.73.15-.26.26-.56.31-.88.16-.78.05-1.39-.33-1.82-.39-.44-.99-.65-1.82-.65H4.59zm7.25-8.33-1.28 6.58h1.42l.74-3.77h1.14c.36 0 .6.06.71.18s.13.34.07.66l-.57 2.93h1.45l.59-3.07c.13-.62.03-1.07-.27-1.36-.3-.27-.85-.4-1.65-.4h-1.27L12 7.35zM18 10.13c.55 0 .91.1 1.09.31.18.2.22.56.13 1.03-.1.53-.29.87-.57 1.09-.29.22-.72.33-1.3.33h-.85l.5-2.76zm-3.5 5.55h1.44l.34-1.75h1.22c.55 0 1-.06 1.35-.17.35-.12.65-.31.95-.58.24-.22.44-.46.58-.73.15-.26.26-.56.32-.88.15-.78.04-1.39-.34-1.82-.36-.44-.99-.65-1.82-.65h-2.75z\"/></svg>",
      "powerpoint": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"#e64a19\" d=\"M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m7 1.5V9h5.5zM8 11v2h1v6H8v1h4v-1h-1v-2h2a3 3 0 0 0 3-3 3 3 0 0 0-3-3zm5 2a1 1 0 0 1 1 1 1 1 0 0 1-1 1h-2v-2z\"/></svg>",
      "powershell": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#03a9f4\" d=\"M29.07 6H7.677A1.535 1.535 0 0 0 6.24 7.113l-4.2 17.774A.852.852 0 0 0 2.93 26h21.393a1.535 1.535 0 0 0 1.436-1.113L29.96 7.112A.852.852 0 0 0 29.07 6M8.626 23.797a1.4 1.4 0 0 1-1.814-.31l-.007-.009a1.075 1.075 0 0 1 .315-1.599l9.6-6.061-6.102-5.852-.01-.01a1.068 1.068 0 0 1 .084-1.625l.037-.03a1.38 1.38 0 0 1 1.8.07l7.233 6.957a1.1 1.1 0 0 1 .236.739 1.08 1.08 0 0 1-.412.79c-.074.04-.146.119-10.951 6.935ZM24 22.94A1.135 1.135 0 0 1 22.803 24h-5.634a1.061 1.061 0 1 1 .001-2.112h5.633A1.134 1.134 0 0 1 24 22.938Z\"/></svg>",
      "python": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"#0288d1\" d=\"M9.86 2A2.86 2.86 0 0 0 7 4.86v1.68h4.29c.39 0 .71.57.71.96H4.86A2.86 2.86 0 0 0 2 10.36v3.781a2.86 2.86 0 0 0 2.86 2.86h1.18v-2.68a2.85 2.85 0 0 1 2.85-2.86h5.25c1.58 0 2.86-1.271 2.86-2.851V4.86A2.86 2.86 0 0 0 14.14 2zm-.72 1.61c.4 0 .72.12.72.71s-.32.891-.72.891c-.39 0-.71-.3-.71-.89s.32-.711.71-.711\"/><path fill=\"#fdd835\" d=\"M17.959 7v2.68a2.85 2.85 0 0 1-2.85 2.859H9.86A2.85 2.85 0 0 0 7 15.389v3.75a2.86 2.86 0 0 0 2.86 2.86h4.28A2.86 2.86 0 0 0 17 19.14v-1.68h-4.291c-.39 0-.709-.57-.709-.96h7.14A2.86 2.86 0 0 0 22 13.64V9.86A2.86 2.86 0 0 0 19.14 7zM8.32 11.513l-.004.004.038-.004zm6.54 7.276c.39 0 .71.3.71.89a.71.71 0 0 1-.71.71c-.4 0-.72-.12-.72-.71s.32-.89.72-.89\"/></svg>",
      "react": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#00bcd4\" d=\"M16 12c7.444 0 12 2.59 12 4s-4.556 4-12 4-12-2.59-12-4 4.556-4 12-4m0-2c-7.732 0-14 2.686-14 6s6.268 6 14 6 14-2.686 14-6-6.268-6-14-6\"/><path fill=\"#00bcd4\" d=\"M16 14a2 2 0 1 0 2 2 2 2 0 0 0-2-2\"/><path fill=\"#00bcd4\" d=\"M10.458 5.507c2.017 0 5.937 3.177 9.006 8.493 3.722 6.447 3.757 11.687 2.536 12.392a.9.9 0 0 1-.457.1c-2.017 0-5.938-3.176-9.007-8.492C8.814 11.553 8.779 6.313 10 5.608a.9.9 0 0 1 .458-.1m-.001-2A2.87 2.87 0 0 0 9 3.875C6.13 5.532 6.938 12.304 10.804 19c3.284 5.69 7.72 9.493 10.74 9.493A2.87 2.87 0 0 0 23 28.124c2.87-1.656 2.062-8.428-1.804-15.124-3.284-5.69-7.72-9.493-10.74-9.493Z\"/><path fill=\"#00bcd4\" d=\"M21.543 5.507a.9.9 0 0 1 .457.1c1.221.706 1.186 5.946-2.536 12.393-3.07 5.316-6.99 8.493-9.007 8.493a.9.9 0 0 1-.457-.1C8.779 25.686 8.814 20.446 12.536 14c3.07-5.316 6.99-8.493 9.007-8.493m0-2c-3.02 0-7.455 3.804-10.74 9.493C6.939 19.696 6.13 26.468 9 28.124a2.87 2.87 0 0 0 1.457.369c3.02 0 7.455-3.804 10.74-9.493C25.061 12.304 25.87 5.532 23 3.876a2.87 2.87 0 0 0-1.457-.369\"/></svg>",
      "readme": "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 16 16\"><path d=\"M0 0h24v24H0z\"/><path fill=\"#42a5f5\" d=\"M8 1C4.136 1 1 4.136 1 8s3.136 7 7 7 7-3.136 7-7-3.136-7-7-7m1 11H7V7.5h2zm0-6H7V4h2z\"/></svg>",
      "ruby": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"#f44336\" d=\"M18.041 3.177c2.24.382 2.879 1.919 2.843 3.527V6.67l-1.013 13.266-13.132.897h.008c-1.093-.044-3.518-.151-3.634-3.545l1.217-2.222 2.462 5.74 2.097-6.77-.045.009.018-.018 6.85 2.186L13.945 9.3l6.53-.409-5.144-4.212 2.71-1.51v.009M3.113 17.252v.017zM6.916 6.874c2.63-2.622 6.033-4.168 7.34-2.844 1.297 1.306-.072 4.523-2.702 7.135-2.666 2.613-6.015 4.248-7.322 2.933-1.306-1.324.036-4.612 2.675-7.224z\"/></svg>",
      "rust": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#ff7043\" d=\"m30 12-4-2V6h-4l-2-4-4 2-4-2-2 4H6v4l-4 2 2 4-2 4 4 2v4h4l2 4 4-2 4 2 2-4h4v-4l4-2-2-4ZM6 16a9.9 9.9 0 0 1 .842-4H10v8H6.842A9.9 9.9 0 0 1 6 16m10 10a9.98 9.98 0 0 1-7.978-4H16v-2h-2v-2h4c.819.819.297 2.308 1.179 3.37a1.89 1.89 0 0 0 1.46.63h3.34A9.98 9.98 0 0 1 16 26m-2-12v-2h4a1 1 0 0 1 0 2Zm11.158 6H24a2.006 2.006 0 0 1-2-2 2 2 0 0 0-2-2 3 3 0 0 0 3-3q0-.08-.004-.161A3.115 3.115 0 0 0 19.83 10H8.022a9.986 9.986 0 0 1 17.136 10\"/></svg>",
      "sass": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#ec407a\" d=\"M27.837 5.673a4.33 4.33 0 0 0-2.293-2.701c-2.362-1.261-6.11-1.298-9.548-.092a26.3 26.3 0 0 0-8.76 4.966c-2.752 2.542-3.438 4.925-3.189 6.194.523 2.668 3.274 4.539 5.485 6.042.418.284.822.559 1.175.816-1.429.76-4.261 2.444-5.088 4.248a3.88 3.88 0 0 0-.118 3.332A2.37 2.37 0 0 0 6.869 29.8a5.6 5.6 0 0 0 1.49.2 6.35 6.35 0 0 0 5.19-2.856 6.74 6.74 0 0 0 .864-5.382 7.3 7.3 0 0 1 2.044-.03 3.92 3.92 0 0 1 2.816 1.311 1.82 1.82 0 0 1 .423 1.262 1.55 1.55 0 0 1-.772 1.05c-.234.14-.586.355-.504.803.036.194.198.633.894.512a2.93 2.93 0 0 0 2.145-2.651 4 4 0 0 0-1.197-2.904 5.94 5.94 0 0 0-4.396-1.626 10.6 10.6 0 0 0-2.672.304 20 20 0 0 0-2.203-1.846c-1.712-1.3-3.33-2.529-3.235-4.26.125-2.263 2.468-4.532 6.964-6.744 4.016-1.976 7.254-2.037 8.944-1.438a2 2 0 0 1 1.204.883 2.77 2.77 0 0 1-.36 2.47 9.71 9.71 0 0 1-7.425 4.304 3.86 3.86 0 0 1-3.238-.757c-.278-.302-.593-.645-1.074-.383q-.565.31-.225 1.189a3.9 3.9 0 0 0 2.407 1.92 11.7 11.7 0 0 0 7.128-.671c3.527-1.35 6.681-5.202 5.756-8.787M11.895 24.475a4 4 0 0 1-.192.468 4.5 4.5 0 0 1-.753 1.081 2.83 2.83 0 0 1-2.533 1.107c-.056-.032-.078-.146-.085-.193a3.28 3.28 0 0 1 1.076-2.284 11.3 11.3 0 0 1 2.644-1.933 3.85 3.85 0 0 1-.157 1.754\"/></svg>",
      "settings": "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\"><path d=\"M0 0h24v24H0z\"/><path fill=\"#42a5f5\" d=\"M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.49.49 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.6.6 0 0 0-.18-.03c-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46a.5.5 0 0 0 .61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1q.09.03.18.03c.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64zm-1.98-1.71c.04.31.05.52.05.73s-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7 1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2 1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21 1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21 1.27.51 1.04.42.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13 1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7 1.21-1.07.85-.89.7zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4m0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2\"/></svg>",
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#ffb300\" d=\"M29.168 14.03a2.7 2.7 0 0 0-1.968-.83 2.51 2.51 0 0 0-1.929.8h-4.443l3.078-3.078a2.835 2.835 0 0 0 2.857-2.842 2.6 2.6 0 0 0-.831-1.969 2.82 2.82 0 0 0-2.014-.788 2.67 2.67 0 0 0-1.968.788 2.36 2.36 0 0 0-.812 1.922L18 11.17V6.726a2.51 2.51 0 0 0 .8-1.929 2.7 2.7 0 0 0-.832-1.968 2.745 2.745 0 0 0-3.936 0 2.7 2.7 0 0 0-.832 1.968 2.51 2.51 0 0 0 .8 1.93v4.443l-3.138-3.138a2.36 2.36 0 0 0-.812-1.922 2.66 2.66 0 0 0-1.968-.788 2.83 2.83 0 0 0-2.014.788 2.6 2.6 0 0 0-.831 1.969 2.74 2.74 0 0 0 .831 2.013 2.8 2.8 0 0 0 2.026.829l3.078 3.078H6.729a2.51 2.51 0 0 0-1.929-.8 2.7 2.7 0 0 0-1.968.831 2.745 2.745 0 0 0 0 3.937 2.7 2.7 0 0 0 1.968.832 2.51 2.51 0 0 0 1.929-.8h4.443l-3.078 3.077a2.835 2.835 0 0 0-2.857 2.842 2.6 2.6 0 0 0 .831 1.969 2.82 2.82 0 0 0 2.014.788 2.67 2.67 0 0 0 1.968-.788 2.36 2.36 0 0 0 .812-1.922L14 20.827v4.444a2.51 2.51 0 0 0-.8 1.929 2.784 2.784 0 0 0 4.768 1.968A2.7 2.7 0 0 0 18.8 27.2a2.51 2.51 0 0 0-.8-1.929v-4.444l3.138 3.138a2.36 2.36 0 0 0 .812 1.922 2.66 2.66 0 0 0 1.968.788 2.83 2.83 0 0 0 2.014-.788 2.6 2.6 0 0 0 .831-1.969 2.74 2.74 0 0 0-.831-2.013 2.8 2.8 0 0 0-2.026-.829L20.828 18h4.443a2.51 2.51 0 0 0 1.93.8 2.784 2.784 0 0 0 1.967-4.769Z\"/></svg>",
      "table": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"#8bc34a\" d=\"M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m7 1.5V9h5.5zm4 7.5h-4v2h1l-2 1.67L10 13h1v-2H7v2h1l3 2.5L8 18H7v2h4v-2h-1l2-1.67L14 18h-1v2h4v-2h-1l-3-2.5 3-2.5h1z\"/></svg>",
      "toml": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill=\"#cfd8dc\" d=\"M4 6V4h8v2H9v7H7V6z\"/><path fill=\"#ef5350\" d=\"M4 1v1H2v12h2v1H1V1zm8 0v1h2v12h-2v1h3V1z\"/></svg>",
      "typescript": "<svg xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" viewBox=\"0 0 16 16\"><path fill=\"#0288d1\" d=\"M2 2v12h12V2zm4 6h3v1H8v4H7V9H6zm5 0h2v1h-2v1h1a1.003 1.003 0 0 1 1 1v1a1.003 1.003 0 0 1-1 1h-2v-1h2v-1h-1a1.003 1.003 0 0 1-1-1V9a1.003 1.003 0 0 1 1-1\"/></svg>",
      "uml": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><path fill=\"#b39ddb\" d=\"M87 76.652 53.84 93.907l-.038-41.04 13.9-7.15v29.622l19.224-9.85z\"/><path fill=\"#fbc02d\" d=\"m38.693 89.604 8.576 4.303V52.743l-13.027-6.29-4.126 19.643-4.16-23.69L13 36.077V77.28l8.54 4.378V56.826l4.669 26.817 7.599 3.863 4.885-22.293z\"/><path fill=\"#f06292\" d=\"m45.237 6.093-9.775 8.755s19.072 9.931 21.39 11.105c2.317 1.173 5.615 3.43 2.05 6.771s-7.487 2.89-10.16 1.535a21830 21830 0 0 1-22.458-11.466l-10.07 8.667S35.642 41.48 38.85 43.196c3.208 1.715 15.15 5.958 26.47-2.98 11.318-8.937 9.714-12.188 9.714-12.82s-.267-3.972-2.228-6.048c-1.96-2.077-7.664-5.056-10.07-6.32S45.239 6.092 45.239 6.092z\"/></svg>",
      "video": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#ff9800\" d=\"m24 6 2 6h-4l-2-6h-3l2 6h-4l-2-6h-3l2 6H8L6 6H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h22a3 3 0 0 0 3-3V6Z\"/></svg>",
      "word": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"#01579b\" d=\"M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m7 1.5V9h5.5zM7 13l1.5 7h2l1.5-3 1.5 3h2l1.5-7h1v-2h-4v2h1l-.9 4.2L13 15h-2l-1.1 2.2L9 13h1v-2H6v2z\"/></svg>",
      "xml": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"#8bc34a\" d=\"M13 9h5.5L13 3.5zM6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m.12 13.5 3.74 3.74 1.42-1.41-2.33-2.33 2.33-2.33-1.42-1.41zm11.16 0-3.74-3.74-1.42 1.41 2.33 2.33-2.33 2.33 1.42 1.41z\"/></svg>",
      "yaml": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"#ff5252\" d=\"M13 9h5.5L13 3.5zM6 2h8l6 6v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2m12 16v-2H9v2zm-4-4v-2H6v2z\"/></svg>",
      "zip": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"#afb42b\" d=\"M14 17h-2v-2h-2v-2h2v2h2m0-6h-2v2h2v2h-2v-2h-2V9h2V7h-2V5h2v2h2m5-4H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2\"/></svg>",
    };
    // #endregion file-icons
    const FILE_ICON_MAP = {
      md: 'markdown', mdx: 'markdown',
      txt: 'document', rst: 'document', org: 'document', log: 'document',
      pdf: 'pdf',
      doc: 'word', docx: 'word', rtf: 'word', odt: 'word',
      csv: 'table', tsv: 'table', xlsx: 'table', xls: 'table', ods: 'table',
      ppt: 'powerpoint', pptx: 'powerpoint', key: 'powerpoint', odp: 'powerpoint',
      png: 'image', jpg: 'image', jpeg: 'image', webp: 'image', gif: 'image', bmp: 'image', avif: 'image', ico: 'image',
      svg: 'svg',
      mp4: 'video', webm: 'video', mov: 'video', m4v: 'video', mkv: 'video', avi: 'video',
      mp3: 'audio', wav: 'audio', m4a: 'audio', ogg: 'audio', flac: 'audio', aac: 'audio',
      woff: 'font', woff2: 'font', ttf: 'font', otf: 'font',
      html: 'html', htm: 'html',
      css: 'css', scss: 'sass', sass: 'sass', less: 'less',
      js: 'javascript', mjs: 'javascript', cjs: 'javascript',
      ts: 'typescript', mts: 'typescript', cts: 'typescript',
      jsx: 'react', tsx: 'react',
      py: 'python', pyi: 'python',
      sh: 'console', bash: 'console', zsh: 'console',
      ps1: 'powershell', psm1: 'powershell',
      json: 'json', jsonc: 'json',
      yaml: 'yaml', yml: 'yaml', toml: 'toml', xml: 'xml',
      go: 'go', rs: 'rust', java: 'java',
      c: 'c', h: 'c', cc: 'cpp', cpp: 'cpp', cxx: 'cpp', hpp: 'cpp',
      rb: 'ruby', php: 'php', lua: 'lua',
      sql: 'database', db: 'database', sqlite: 'database',
      diff: 'diff', patch: 'diff',
      mmd: 'mermaid', mermaid: 'mermaid',
      drawio: 'drawio', dio: 'drawio',
      puml: 'uml', pu: 'uml', plantuml: 'uml',
      zip: 'zip', tar: 'zip', gz: 'zip', tgz: 'zip', '7z': 'zip', rar: 'zip', zst: 'zip',
      ini: 'settings', conf: 'settings', properties: 'settings', env: 'settings',
      lock: 'lock',
    };
    const FILE_NAME_RULES = [
      [/^readme(\..*)?$/, 'readme'],
      [/^(license|licence|copying)(\..*)?$/, 'license'],
      [/^package\.json$/, 'nodejs'],
      [/^(package-lock\.json|npm-shrinkwrap\.json)$/, 'lock'],
      [/^(pnpm-lock\.yaml|yarn\.lock|bun\.lockb)$/, 'lock'],
      [/^\.git(ignore|attributes|modules)$/, 'git'],
      [/^dockerfile$/, 'docker'],
      [/^docker-compose\.ya?ml$/, 'docker'],
      [/^makefile$/, 'makefile'],
      [/^\.editorconfig$/, 'settings'],
      [/^tsconfig(\..*)?\.json$/, 'typescript'],
    ];
    const KIND_RULES = {
      plan: 'kindRulePlan', walkthrough: 'kindRuleWalkthrough', change: 'kindRuleChange', diagram: 'kindRuleDiagram',
      evidence: 'kindRuleEvidence', preview: 'kindRulePreview', document: 'kindRuleDocument', code: 'kindRuleCode',
      other: 'kindRuleOther', untagged: 'kindRuleUntagged',
    };
    const SPECIAL_FILE_HINTS = {
      readme: 'README*', license: 'LICENSE / COPYING', nodejs: 'package.json',
      lock: 'pnpm-lock.yaml / yarn.lock / package-lock.json', git: '.gitignore / .gitattributes / .gitmodules',
      docker: 'Dockerfile / docker-compose.yml', makefile: 'Makefile', settings: '.editorconfig',
    };
    const KIND_SAMPLE = {
      plan: 'plan.md', walkthrough: 'walkthrough.md', change: 'changes.diff', diagram: 'flow.mmd',
      evidence: 'shot.png', preview: 'index.html', document: 'notes.md', code: 'index.js',
      other: 'unknown.bin', untagged: 'notes.md',
    };
    const KIND_TONE = {
      plan: '#5b8def', walkthrough: '#3aa88f', change: '#d4803f', diagram: '#8a7be0',
      evidence: '#3f9e63', preview: '#c99a3d', document: '#4a8fbd', code: '#7d6bd6',
      other: '#7a7a7a', untagged: '#6f6f6f',
    };
    const KIND_PATHS = {
      plan: ['M9 6h9', 'M9 12h9', 'M9 18h9', 'M5 6l1.5 1.5L9 5', 'M5 12l1.5 1.5L9 11'],
      walkthrough: ['M4 6h10', 'M4 12h16', 'M4 18h8', 'M18 6l2 2-2 2'],
      change: ['M7 4v16', 'M12 8h8', 'M12 16h8', 'M4 12h4'],
      diagram: ['M5 5h5v5H5z', 'M14 14h5v5h-5z', 'M7.5 10v4h6'],
      evidence: ['M4 5h16v14H4z', 'M4 15l4-4 5 5 3-3 4 4'],
      preview: ['M4 5h16v12H4z', 'M4 9h16', 'M9 21h6'],
      untagged: ['M5 6h14v12H5z', 'M9 10h6', 'M9 14h4'],
      document: ['M6 3h8l4 4v14H6z', 'M14 3v5h4', 'M9 13h6', 'M9 17h6'],
      code: ['M8 8l-4 4 4 4', 'M16 8l4 4-4 4', 'M13 6l-2 12'],
      other: ['M5 6h14v12H5z', 'M5 10h14'],
    };

    function KindIcon({ kind, size = 18 }) {
      const customKind = (prefs.artifactKinds || []).find((entry) => entry.id === kind);
      const tone = (customKind && customKind.tone) || KIND_TONE[kind] || KIND_TONE.other;
      const glyph = Math.max(10, Math.round(size * 0.66));
      const radius = Math.max(3, Math.round(size * 0.22));
      const iconId = (prefs.kindIcons && prefs.kindIcons[kind]) || (customKind && customKind.icon);
      const material = iconId && FILE_ICONS[iconId];
      if (material) {
        return h('span', {
          className: 'dsa-kicon dsa-kiconMaterial', 'aria-hidden': 'true',
          style: { width: size, height: size, background: tone, borderRadius: radius, padding: Math.max(2, Math.round(size * 0.18)) },
          dangerouslySetInnerHTML: { __html: material },
        });
      }
      const paths = KIND_PATHS[kind] || KIND_PATHS.other;
      return h('span', {
        className: 'dsa-kicon', 'aria-hidden': 'true',
        style: { width: size, height: size, background: tone, borderRadius: radius },
      }, h('svg', {
        width: glyph, height: glyph, viewBox: '0 0 24 24', fill: 'none',
        stroke: '#ffffff', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
      }, paths.map((d, index) => h('path', { key: index, d }))));
    }


    function ControlIcon({ paths, size = 15 }) {
      return h('svg', {
        width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
        'aria-hidden': 'true', focusable: 'false',
      }, paths.map((d, index) => h('path', { key: index, d })));
    }

    const GROUP_ICONS = {
      purpose: ['M4 4h7v7H4z', 'M13 4h7v7h-7z', 'M4 13h7v7H4z', 'M14 16.5h6', 'M17 13.5v6'],
      file: ['M6 3h8l4 4v14H6z', 'M14 3v5h4'],
      session: ['M4 5h16v11H9l-5 4z'],
    };
    const VIEW_ICONS = {
      details: ['M4 6h7', 'M4 12h7', 'M4 18h7', 'M14 6h6', 'M14 12h6', 'M14 18h6'],
      list: ['M8 6h12', 'M8 12h12', 'M8 18h12', 'M4.5 6h.01', 'M4.5 12h.01', 'M4.5 18h.01'],
      tiles: ['M4 4h7v7H4z', 'M13 4h7v7h-7z', 'M4 13h7v7H4z', 'M13 13h7v7h-7z'],
      icons: ['M5 5h5v5H5z', 'M14 5h5v5h-5z', 'M5 14h5v5H5z', 'M14 14h5v5h-5z', 'M6.5 7.5h2', 'M6.5 16.5h2', 'M15.5 7.5h2'],
      content: ['M5 5h14v14H5z', 'M8 9h8', 'M8 12h8', 'M8 15h5'],
    };

    // #region type-groups
    // 文件类型组：图标绑定的单位；一组包含一个或多个扩展名 + 可选特殊文件名。
    const MAX_TYPE_GROUPS = 80;
    const MAX_TYPE_EXTENSIONS = 400;
    const TYPE_LABELS = {
      zh: {
        audio: '音频', c: 'C', console: 'Shell', cpp: 'C++', css: 'CSS', database: '数据库', diff: '代码差异',
        docker: 'Docker', document: '文档', drawio: 'draw.io', font: '字体', git: 'Git', go: 'Go', html: 'HTML',
        image: '图片', java: 'Java', javascript: 'JavaScript', json: 'JSON', less: 'Less', license: '许可证',
        lock: '锁文件', lua: 'Lua', makefile: 'Makefile', markdown: 'Markdown', mermaid: 'Mermaid', nodejs: 'Node',
        pdf: 'PDF', php: 'PHP', powerpoint: '演示文稿', python: 'Python', react: 'React', readme: 'README',
        ruby: 'Ruby', rust: 'Rust', sass: 'Sass', settings: '配置', svg: 'SVG', table: '表格', toml: 'TOML',
        typescript: 'TypeScript', uml: 'UML', video: '视频', word: 'Word', xml: 'XML', yaml: 'YAML', zip: '压缩包',
        powershell: 'PowerShell',
      },
      en: {
        audio: 'Audio', c: 'C', console: 'Shell', cpp: 'C++', css: 'CSS', database: 'Database', diff: 'Diff',
        docker: 'Docker', document: 'Document', drawio: 'draw.io', font: 'Font', git: 'Git', go: 'Go', html: 'HTML',
        image: 'Image', java: 'Java', javascript: 'JavaScript', json: 'JSON', less: 'Less', license: 'License',
        lock: 'Lockfile', lua: 'Lua', makefile: 'Makefile', markdown: 'Markdown', mermaid: 'Mermaid', nodejs: 'Node',
        pdf: 'PDF', php: 'PHP', powerpoint: 'PowerPoint', python: 'Python', react: 'React', readme: 'README',
        ruby: 'Ruby', rust: 'Rust', sass: 'Sass', settings: 'Settings', svg: 'SVG', table: 'Table', toml: 'TOML',
        typescript: 'TypeScript', uml: 'UML', video: 'Video', word: 'Word', xml: 'XML', yaml: 'YAML', zip: 'Zip',
        powershell: 'PowerShell',
      },
    };
    const TYPE_SPECIALS = {
      readme: ['README*'], license: ['LICENSE*', 'LICENCE*', 'COPYING*'], nodejs: ['package.json'],
      lock: ['package-lock.json', 'npm-shrinkwrap.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lockb'],
      git: ['.gitignore', '.gitattributes', '.gitmodules'],
      docker: ['Dockerfile', 'docker-compose.yaml', 'docker-compose.yml'], makefile: ['Makefile'], settings: ['.editorconfig'],
      typescript: ['tsconfig*.json'],
    };
    const TYPE_SPECIAL_INDEX = (() => {
      const index = new Map();
      for (const [id, names] of Object.entries(TYPE_SPECIALS)) for (const name of names) index.set(name.toLowerCase(), id);
      return index;
    })();

    function typeLabel(id, locale) {
      return (TYPE_LABELS[locale] || TYPE_LABELS.zh)[id] || id;
    }

    let TYPE_SEED_CACHE = null;
    function typeSeed(locale = 'zh') {
      if (TYPE_SEED_CACHE && TYPE_SEED_CACHE.locale === locale) return TYPE_SEED_CACHE.groups;
      const groups = [];
      for (const icon of Object.keys(FILE_ICONS).sort()) {
        const extensions = Object.keys(FILE_ICON_MAP).filter((extension) => FILE_ICON_MAP[extension] === icon).sort();
        groups.push({
          id: icon,
          label: typeLabel(icon, locale),
          icon,
          extensions,
          specials: (TYPE_SPECIALS[icon] || []).slice(),
          builtin: true,
        });
      }
      TYPE_SEED_CACHE = { locale, groups };
      return groups;
    }
    function defaultTypeGroups(locale = 'zh') {
      return typeSeed(locale).map((group) => ({
        ...group, extensions: group.extensions.slice(), specials: group.specials.slice(),
      }));
    }

    function normalizeTypeGroups(raw, locale = 'zh') {
      if (!Array.isArray(raw) || raw.length === 0) return null;
      const seenIds = new Set();
      const extensionOwner = new Map();
      const specialOwner = new Map();
      const groups = [];
      for (const entry of raw) {
        if (!entry || typeof entry !== 'object') continue;
        if (groups.length >= MAX_TYPE_GROUPS) break;
        const icon = typeof entry.icon === 'string' ? entry.icon : '';
        if (!FILE_ICONS[icon]) continue;
        const id = typeof entry.id === 'string' && entry.id !== '' && !seenIds.has(entry.id) ? entry.id : icon + '-' + groups.length;
        seenIds.add(id);
        const label = typeof entry.label === 'string' && entry.label.trim() !== '' ? entry.label.trim() : typeLabel(icon, locale);
        const extensions = [];
        let extensionTotal = 0;
        for (const value of Array.isArray(entry.extensions) ? entry.extensions : []) {
          if (typeof value !== 'string') continue;
          const extension = value.trim().replace(/^\./, '').toLowerCase();
          if (extension === '' || extensionOwner.has(extension)) continue;
          if (extensionTotal >= MAX_TYPE_EXTENSIONS) break;
          extensionOwner.set(extension, id);
          extensions.push(extension);
          extensionTotal += 1;
        }
        const specials = [];
        for (const value of Array.isArray(entry.specials) ? entry.specials : []) {
          if (typeof value !== 'string') continue;
          const special = value.trim();
          const key = special.toLowerCase();
          if (special === '' || specialOwner.has(key)) continue;
          specialOwner.set(key, id);
          specials.push(special);
        }
        groups.push({ id, label, icon, extensions, specials, builtin: entry.builtin === true });
      }
      return groups.length > 0 ? groups : null;
    }

    function specialMatcher(pattern) {
      const escaped = pattern.replace(/[.+?^${}()|[\\]\\]/g, '\\$&').replace(/\*/g, '.*');
      return new RegExp('^' + escaped + '$', 'i');
    }

    function resolveTypeGroup(path, groups) {
      const list = Array.isArray(groups) && groups.length > 0 ? groups : typeSeed(language);
      const base = (String(path).split(/[\\/]+/).filter(Boolean).pop() || '').toLowerCase();
      for (const group of list) {
        for (const special of group.specials || []) {
          if (specialMatcher(special).test(base)) return { group, source: 'special' };
        }
      }
      const dot = base.lastIndexOf('.');
      const extension = dot > 0 ? base.slice(dot + 1) : '';
      if (extension !== '') {
        for (const group of list) {
          if ((group.extensions || []).includes(extension)) return { group, source: 'extension' };
        }
      }
      return { group: null, source: 'fallback' };
    }

    function typeIconOf(path, groups) {
      const resolved = resolveTypeGroup(path, groups);
      return resolved.group ? resolved.group.icon : null;
    }

    // 旧 per-path/ext/name 覆盖迁移到类型组；path 级无法表达，丢弃。
    function migrateIconOverrides(value) {
      if (!value || !Array.isArray(value.iconOverrides) || value.iconOverrides.length === 0) return false;
      if (Array.isArray(value.fileTypes) && value.fileTypes.length > 0) return false;
      const groups = defaultTypeGroups(language);
      const owner = (icon) => groups.find((group) => group.icon === icon);
      for (const entry of value.iconOverrides) {
        if (!entry || typeof entry.icon !== 'string') continue;
        const group = owner(entry.icon);
        if (!group) continue;
        if (entry.level === 'ext') {
          const extension = String(entry.match || '').trim().replace(/^\./, '').toLowerCase();
          if (extension === '') continue;
          for (const candidate of groups) candidate.extensions = candidate.extensions.filter((value) => value !== extension);
          group.extensions.push(extension);
        } else if (entry.level === 'name') {
          const name = String(entry.match || '').trim();
          if (name === '') continue;
          if (!group.specials.some((value) => value.toLowerCase() === name.toLowerCase())) group.specials.push(name);
        }
      }
      value.fileTypes = groups;
      value.iconOverrides = [];
      return true;
    }

    // #endregion type-groups

    // #region workspace-scope
    // 会话工件默认只显示当前工作区内的路径；工作区外可一键切到全部。
    function normalizePathKey(value) {
      return String(value || '').replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase();
    }
    function isInsideWorkspace(filePath, workspaceRoot) {
      const root = normalizePathKey(workspaceRoot);
      if (root === '') return true;
      const target = normalizePathKey(filePath);
      return target === root || target.startsWith(root + '/');
    }
    // #endregion workspace-scope

    // #region provenance
    // 归属 4 值：交付 / 写入 / 扫描 / 其他会话。
    function provenanceOf(item, currentSessionId) {
      if (!item) return 'written';
      if (item.kind === 'workspace' || item.scanned === true) return 'scan';
      if (currentSessionId && item.sessionId && item.sessionId !== currentSessionId) return 'other';
      return item.kind === 'delivered' ? 'delivered' : 'written';
    }
    // #endregion provenance

    // #region table-columns
    // 详情表列：列宽、显隐、顺序；名称显示去掉日期前缀，时间固定最后一列。
    const TABLE_COLUMN_DEFS = [
      { id: 'name', label: 'colName', width: 240, min: 150 },
      { id: 'kind', label: 'colKind', width: 112, min: 90 },
      { id: 'version', label: 'colVersion', width: 74, min: 62 },
      { id: 'source', label: 'colSource', width: 86, min: 70 },
      { id: 'time', label: 'colTime', width: 124, min: 96 },
    ];
    const TABLE_COLUMN_MAX = 600;
    const TABLE_TYPE_TONES = [
      ['#1f2c46', '#8ab4ff'], ['#2a2340', '#b3a4ff'], ['#1d3328', '#8fd6a0'],
      ['#3a2b1c', '#e8b57a'], ['#3a1f28', '#ff9db0'], ['#1e2f3a', '#7fd0e8'],
      ['#2f2a1a', '#e5d27a'], ['#2a1f3a', '#d3a4ff'], ['#1f3330', '#7fe0cf'],
      ['#33261f', '#e8a58a'], ['#262633', '#b8b8ff'], ['#2f1f22', '#ff8f8f'],
    ];
    function hashText(value) {
      let hash = 0;
      for (let index = 0; index < value.length; index += 1) hash = (hash * 31 + value.charCodeAt(index)) | 0;
      return hash;
    }
    function defaultTableColumns() {
      return {
        order: TABLE_COLUMN_DEFS.map((column) => column.id),
        hidden: ['source'],
        widths: Object.fromEntries(TABLE_COLUMN_DEFS.map((column) => [column.id, column.width])),
      };
    }
    function normalizeTableColumns(raw) {
      const base = defaultTableColumns();
      if (!raw || typeof raw !== 'object') return base;
      const known = new Set(base.order);
      const order = [];
      for (const id of Array.isArray(raw.order) ? raw.order : []) {
        if (known.has(id) && !order.includes(id)) order.push(id);
      }
      // 旧快照没有 version：必须插到 kind 后，不能追加到时间后面。
      if (!order.includes('version')) {
        const at = order.indexOf('kind');
        order.splice(at >= 0 ? at + 1 : Math.min(1, order.length), 0, 'version');
      }
      for (const id of base.order) if (!order.includes(id)) order.push(id);
      const hidden = [];
      for (const id of Array.isArray(raw.hidden) ? raw.hidden : []) {
        if (known.has(id) && !hidden.includes(id)) hidden.push(id);
      }
      const widths = { ...base.widths };
      const rawWidths = raw.widths && typeof raw.widths === 'object' ? raw.widths : {};
      for (const column of TABLE_COLUMN_DEFS) {
        const value = Number(rawWidths[column.id]);
        if (Number.isFinite(value)) widths[column.id] = Math.max(column.min, Math.min(TABLE_COLUMN_MAX, Math.round(value)));
      }
      if (order.every((id) => hidden.includes(id))) hidden.splice(0, hidden.length, ...order.slice(1));
      return { order, hidden, widths };
    }
    function displayFileName(name) {
      return String(name).replace(/^\d{4}-\d{2}-\d{2}[_-]?/, '') || String(name);
    }
    function typeTagOf(path, groups) {
      const resolved = resolveTypeGroup(path, groups);
      return resolved.group ? { group: resolved.group, tone: TABLE_TYPE_TONES[Math.abs(hashText(resolved.group.id)) % TABLE_TYPE_TONES.length] } : null;
    }
    function sourceTagOf(item) {
      return item && item.kind === 'workspace' ? 'scan' : 'submit';
    }
    // #endregion table-columns

    // #region icon-resolve
    // 解析顺序：路径覆盖 > 文件名覆盖 > 扩展名覆盖 > 内置特殊名 > 内置扩展名。
    // 返回 { icon, source } 或 null；icon id 不存在时跳过该覆盖。
    function resolveFileIcon(path, overrides, icons) {
      const base = String(path).split(/[\\/]+/).filter(Boolean).pop() || '';
      const lower = base.toLowerCase();
      const dot = lower.lastIndexOf('.');
      const extension = dot > 0 ? '.' + lower.slice(dot + 1) : '';
      const usable = (Array.isArray(overrides) ? overrides : []).filter((entry) => entry
        && ['path', 'name', 'ext'].includes(entry.level)
        && typeof entry.match === 'string'
        && typeof entry.icon === 'string'
        && icons[entry.icon]);
      const pathText = String(path);
      for (const entry of usable) {
        if (entry.level === 'path' && pathText === entry.match) return { icon: entry.icon, source: 'path' };
      }
      for (const entry of usable) {
        if (entry.level === 'name' && lower === entry.match.toLowerCase()) return { icon: entry.icon, source: 'name' };
      }
      for (const entry of usable) {
        if (entry.level === 'ext') {
          const match = '.' + entry.match.replace(/^\./, '').toLowerCase();
          if (match === extension) return { icon: entry.icon, source: 'ext' };
        }
      }
      for (const [rule, id] of FILE_NAME_RULES) {
        if (rule.test(lower)) return { icon: id, source: 'special' };
      }
      if (FILE_ICON_MAP[lower.slice(dot + 1)] && dot > 0) return { icon: FILE_ICON_MAP[lower.slice(dot + 1)], source: 'extension' };
      return null;
    }

    function fileIconOf(path, overrides) {
      const resolved = resolveFileIcon(path, overrides || prefs.iconOverrides, FILE_ICONS);
      return resolved ? resolved.icon : null;
    }
    // #endregion icon-resolve

    function FileIcon({ path, kind, size = 18 }) {
      const svg = FILE_ICONS[typeIconOf(path, prefs.fileTypes)];
      if (!svg) return h(KindIcon, { kind, size });
      return h('span', {
        className: 'dsa-ficon', 'aria-hidden': 'true',
        style: { width: size, height: size },
        dangerouslySetInnerHTML: { __html: svg },
      });
    }

    const INDEX_CACHE_MAX = 12;
    const INDEX_CACHE = new Map();
    function indexCacheKey({ mode, sessionId, workspace, query, hideCode, scan, policy }) {
      return JSON.stringify([mode, sessionId, workspace, query, hideCode === true, scan === true, policy]);
    }
    function indexCacheGet(key) {
      const value = INDEX_CACHE.get(key);
      if (!value) return undefined;
      INDEX_CACHE.delete(key);
      INDEX_CACHE.set(key, value);
      return value;
    }
    function indexCacheSet(key, value) {
      INDEX_CACHE.delete(key);
      INDEX_CACHE.set(key, value);
      while (INDEX_CACHE.size > INDEX_CACHE_MAX) INDEX_CACHE.delete(INDEX_CACHE.keys().next().value);
    }

    function MarqueeName({ text, className, title }) {
      const ref = useRef(null);
      const timer = useRef(0);
      const stop = () => {
        clearTimeout(timer.current);
        const box = ref.current;
        if (box) {
          box.classList.remove('dsa-marqueeOn', 'dsa-marqueeMeasure');
          box.style.removeProperty('--dsa-shift');
          box.style.removeProperty('--dsa-dur');
        }
      };
      const start = () => {
        const box = ref.current;
        if (!box) return;
        const inner = box.firstElementChild;
        if (!inner) return;
        box.classList.add('dsa-marqueeMeasure');
        const overflow = inner.scrollWidth - box.clientWidth;
        box.classList.remove('dsa-marqueeMeasure');
        if (overflow <= 2) return;
        timer.current = setTimeout(() => {
          box.style.setProperty('--dsa-shift', '-' + overflow + 'px');
          box.style.setProperty('--dsa-dur', Math.max(1.4, Math.min(5, overflow / 38)) + 's');
          box.classList.add('dsa-marqueeOn');
        }, 180);
      };
      return h('span', {
        ref, className: 'dsa-marqueeName ' + (className || ''), title: title || text,
        onMouseEnter: start, onMouseLeave: stop,
      }, h('span', { className: 'dsa-marqueeInner' }, text));
    }

    function useArtifacts({ mode, sessionId, workspace, query, hideCode, scan, policy }) {
      const cacheKey = indexCacheKey({ mode, sessionId, workspace, query, hideCode, scan, policy });
      const [state, setState] = useState(() => {
        const cached = indexCacheGet(cacheKey);
        return cached ? { ...cached, loading: false, error: null } : { items: [], total: 0, facets: {}, meta: { sessions: [], workspaces: [] }, hasMore: false, loading: true, error: null };
      });
      const [reloadToken, setReloadToken] = useState(0);
      const requestRef = useRef(0);
      const stateRef = useRef(null);
      const gitRequested = useRef(new Set());
      stateRef.current = state;

      useEffect(() => {
        const cached = indexCacheGet(cacheKey);
        if (cached) {
          setState({ ...cached, loading: false, error: null });
          return;
        }
        const controller = new AbortController();
        const ticket = ++requestRef.current;
        setState((current) => ({ ...current, loading: true, error: null }));
        request('items', {
          scope: mode, sessionId, workspace: workspace || undefined,
          query: query || undefined, hideCode: hideCode === true, scan: scan === true, policy, offset: 0, limit: 60,
        }, controller.signal).then((data) => {
          if (ticket !== requestRef.current) return;
          setState({ items: data.items, total: data.total, facets: data.facets || {}, meta: data.meta, hasMore: data.hasMore, loading: false, error: null });
        }).catch((error) => {
          if (controller.signal.aborted || ticket !== requestRef.current) return;
          setState((current) => ({ ...current, loading: false, error: String(error.message || error) }));
        });
        return () => controller.abort();
      }, [cacheKey, reloadToken]);

      useEffect(() => {
        if (!state.loading && !state.error) indexCacheSet(cacheKey, state);
      }, [cacheKey, state]);

      useEffect(() => {
        gitRequested.current = new Set();
      }, [cacheKey]);

      useEffect(() => {
        const pending = state.items
          .filter((item) => item.gitPending && !gitRequested.current.has(item.path))
          .map((item) => item.path);
        if (pending.length === 0) return undefined;
        const controller = new AbortController();
        for (const value of pending) gitRequested.current.add(value);
        request('git', { paths: pending }, controller.signal, 20000).then((data) => {
          if (controller.signal.aborted) return;
          const git = data && data.git ? data.git : {};
          setState((current) => ({
            ...current,
            items: current.items.map((item) => {
              if (!pending.includes(item.path)) return item;
              return Object.prototype.hasOwnProperty.call(git, item.path)
                ? { ...item, git: git[item.path], gitPending: false, gitError: false }
                : { ...item, gitPending: false, gitError: true };
            }),
          }));
        }).catch(() => {
          if (controller.signal.aborted) return;
          setState((current) => ({
            ...current,
            items: current.items.map((item) => pending.includes(item.path)
              ? { ...item, gitPending: false, gitError: true }
              : item),
          }));
        });
        return () => controller.abort();
      }, [cacheKey, state.items]);

      const loadMore = useCallback(() => {
        const current = stateRef.current;
        if (!current || !current.hasMore || current.loading) return;
        setState((inner) => ({ ...inner, loading: true }));
        request('items', {
          scope: mode, sessionId, workspace: workspace || undefined,
          query: query || undefined, hideCode: hideCode === true, scan: scan === true, policy, offset: current.items.length, limit: 60,
        }).then((data) => {
          setState((inner) => ({
            ...inner, loading: false,
            items: inner.items.concat(data.items), total: data.total,
            hasMore: data.hasMore, meta: data.meta,
          }));
        }).catch(() => setState((inner) => ({ ...inner, loading: false })));
      }, [mode, sessionId, workspace, query, hideCode, scan, policy]);

      const reload = useCallback(() => {
        INDEX_CACHE.delete(cacheKey);
        setReloadToken((value) => value + 1);
      }, [cacheKey]);
      const retryGit = useCallback((target) => {
        gitRequested.current.delete(target);
        setState((current) => ({
          ...current,
          items: current.items.map((item) => item.path === target ? { ...item, gitPending: true, gitError: false } : item),
        }));
      }, []);
      const refresh = useCallback(() => {
        INDEX_CACHE.delete(cacheKey);
        request('refresh', {}).catch(() => {}).then(() => setReloadToken((value) => value + 1));
      }, [cacheKey]);
      return { ...state, loadMore, reload, refresh, retryGit };
    }

    function Toast({ message }) {
      if (!message) return null;
      return h('div', { className: 'dsa-toast', role: 'status', 'aria-live': 'polite' }, message);
    }

    function Detail({ id, workspace, sessionId, onClose, notify }) {
      const [state, setState] = useState({ loading: true, item: null, preview: null, versions: null, oldPreview: null, error: null });
      useEffect(() => {
        const controller = new AbortController();
        setState({ loading: true, item: null, preview: null, versions: null, oldPreview: null, error: null });
        request('detail', { id, workspace: workspace || undefined, sessionId }, controller.signal).then((data) => {
          setState({ loading: false, item: data.item, preview: data.preview, versions: null, oldPreview: null, error: null });
          if (data.item && data.item.git && data.item.git.tracked) {
            request('versions', { path: data.item.path }, controller.signal).then((versions) => {
              if (!controller.signal.aborted) setState((current) => ({ ...current, versions }));
            }).catch(() => {});
          }
        }).catch((error) => {
          if (controller.signal.aborted) return;
          setState({ loading: false, item: null, preview: null, versions: null, oldPreview: null, error: String(error.message || error) });
        });
        return () => controller.abort();
      }, [id, workspace, sessionId]);

      useEffect(() => {
        const onKey = (event) => {
          if (event.key === 'Escape') {
            event.stopPropagation();
            onClose();
          }
        };
        document.addEventListener('keydown', onKey, true);
        return () => document.removeEventListener('keydown', onKey, true);
      }, [onClose]);

      const item = state.item;
      const copy = (text, label) => {
        navigator.clipboard.writeText(text).then(() => notify(label)).catch(() => notify(t().copyFailed));
      };

      return h('div', {
        className: 'dsa-overlay', role: 'presentation',
        onMouseDown: (event) => { if (event.target === event.currentTarget) onClose(); },
      }, h('div', { className: 'dsa-modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': t().detail },
        h(StyleSheet, null),
        h('div', { className: 'dsa-modalHead' },
          h('div', { style: { flex: '1 1 auto', minWidth: 0 } },
            h('h2', { className: 'dsa-modalTitle' }, item ? item.name : t().detail),
            h('div', { className: 'dsa-modalPath', title: item ? item.path : '' }, item ? item.path : '')),
          h('button', { className: 'dsa-iconButton', onClick: onClose, 'aria-label': t().close }, '×')),
        item ? h('div', { className: 'dsa-modalActions' },
          h('button', { className: 'dsa-button', onClick: () => copy(item.path, t().copied) }, t().copyPath),
          h('button', { className: 'dsa-button', onClick: () => copy('[' + item.name + '](' + item.path + ')', t().copied) }, t().copyLink)) : null,
        h('div', { className: 'dsa-modalBody' },
          state.loading ? h('div', { className: 'dsa-loading' }, t().loading) : null,
          state.error ? h('div', { className: 'dsa-error' }, state.error) : null,
          item ? h('dl', { className: 'dsa-kv' },
            h('dt', null, t().detail), h('dd', null, kindLabel(item.kind)
              + (item.description ? ' · ' + item.description : '')),
            h('dt', null, t().changePurpose), h('dd', null, h('select', {
              className: 'dsa-input dsa-tagSelect', value: item.category || 'untagged', 'aria-label': t().changePurpose,
              onChange: (event) => {
                setArtifactTag(item.path, event.target.value);
                setState((current) => ({ ...current, item: current.item ? { ...current.item, category: event.target.value } : current.item }));
              },
            }, [...kindDefinitions().map((kind) => h('option', { key: kind.id, value: kind.id }, kind.custom ? kind.label : t()[kind.labelKey]))])),
            h('dt', null, t().type), h('dd', null, item.type),
            h('dt', null, t().size), h('dd', null, formatBytes(item.size)),
            h('dt', null, t().modified), h('dd', null, formatTime(item.mtime)),
            h('dt', null, t().lastSeen), h('dd', null, formatTime(item.time)),
            h('dt', null, t().firstSeen), h('dd', null, formatTime(item.firstTime)),
            item.occurrences > 1 ? h('dt', null, t().occurrences) : null,
            item.occurrences > 1 ? h('dd', null, format(t().occurrences, { n: item.occurrences })) : null,
            h('dt', null, t().scopeSession), h('dd', null, item.sessionTitle || '—')) : null,
          state.versions && state.versions.commits && state.versions.commits.length > 0 ? h('div', { className: 'dsa-git' },
            h('div', { className: 'dsa-gitHead' }, t().gitHistory),
            state.versions.commits.map((commit, index) => h('button', {
              key: commit.hash, className: 'dsa-gitRow',
              title: commit.hash,
              onClick: () => {
                request('version', { path: item.path, commit: commit.hash }).then((data) => {
                  setState((current) => ({ ...current, oldPreview: { ...data, label: 'v' + (index + 1) } }));
                }).catch((error) => notify(String(error.message || error)));
              },
            },
              h('span', { className: 'dsa-gitV' }, 'v' + (index + 1)),
              h('span', { className: 'dsa-gitHash' }, commit.hash.slice(0, 7)),
              h('span', { className: 'dsa-gitSubject' }, commit.subject || ''),
              h('span', { className: 'dsa-gitTime' }, formatTime(commit.time))))) : null,
          item && (!item.git || !item.git.tracked) ? h('div', { className: 'dsa-note' }, t().noGitHistory) : null,
          state.oldPreview && state.oldPreview.text ? h('pre', { className: 'dsa-pre' }, state.oldPreview.label + '\n\n' + state.oldPreview.text) : null,
          state.preview && state.preview.image ? h('img', { className: 'dsa-img', src: state.preview.image, alt: item ? item.name : '' }) : null,
          state.preview && state.preview.text ? h('pre', { className: 'dsa-pre', tabIndex: 0 }, state.preview.text) : null,
          state.preview && state.preview.missing ? h('div', { className: 'dsa-note' }, t().missing) : null,
          state.preview && state.preview.binary ? h('div', { className: 'dsa-note' }, t().binary) : null,
          state.preview && state.preview.truncated ? h('div', { className: 'dsa-note' }, t().truncated) : null)));
    }

    const sessionItemsCache = new Map();
    function loadSessionItems(sessionId) {
      const cached = sessionItemsCache.get(sessionId);
      if (cached && Date.now() - cached.at < 5000) return cached.promise;
      const promise = request('items', { scope: 'session', sessionId, offset: 0, limit: 100 })
        .then((data) => data.items);
      sessionItemsCache.set(sessionId, { at: Date.now(), promise });
      promise.catch(() => sessionItemsCache.delete(sessionId));
      return promise;
    }

    /** 按 Session ID 分组：会话组按 meta.sessions 顺序，扫描件固定末组。 */
    function shortSessionId(sessionId) {
      return '#' + String(sessionId).replace(/^session-?/, '').slice(-8);
    }

    function groupArtifacts(items, sessions, mode, scan, by) {
      if (by === 'purpose') {
        const definitions = kindDefinitions();
        const order = definitions.filter((kind) => kind.id !== 'untagged').map((kind) => kind.id);
        order.push('untagged');
        return bucketItems(items, (item) => item.category || 'untagged', order).map(({ key, items: groupItems }) => ({
          key: 'purpose:' + key,
          title: artifactKindLabel(key),
          kind: key,
          order: order.indexOf(key),
          items: groupItems,
        }));
      }
      if (by === 'file') {
        const typeGroups = prefs.fileTypes || defaultTypeGroups(language);
        const order = typeGroups.map((group) => group.id);
        const resolved = new Map();
        for (const item of items) {
          const match = resolveTypeGroup(item.path, typeGroups);
          resolved.set(item.id, match.group || null);
        }
        const buckets = bucketItems(items, (item) => {
          const group = resolved.get(item.id);
          return group ? group.id : '__other';
        }, order);
        return buckets.map(({ key, items: groupItems }) => {
          const group = typeGroups.find((entry) => entry.id === key);
          return {
            key: 'file:' + key,
            title: group ? group.label : t().other,
            fileType: group || null,
            order: order.indexOf(key),
            items: groupItems,
          };
        });
      }
      if (mode === 'session') {
        const own = [];
        const scanned = [];
        for (const item of items) (item.kind === 'workspace' || item.scanned === true ? scanned : own).push(item);
        const groups = [];
        if (own.length > 0) groups.push({ key: 'session', title: t().scopeSession, hint: shortSessionId(own[0].sessionId), order: 0, items: own });
        if (scanned.length > 0) groups.push({ key: '__scan', title: t().scanGroup, hint: scan && scan.root ? scan.root : '', order: 1, items: scanned });
        return groups;
      }
      const order = new Map();
      const known = new Map();
      (sessions || []).forEach((session, index) => {
        order.set(session.id, index);
        known.set(session.id, session);
      });
      const groups = new Map();
      for (const item of items) {
        const key = item.sessionId || '__scan';
        if (!groups.has(key)) {
          if (key === '__scan') {
            groups.set(key, { key, title: t().scanGroup, hint: scan && scan.root ? scan.root : '', order: Number.MAX_SAFE_INTEGER, items: [] });
          } else {
            const session = known.get(key);
            groups.set(key, {
              key,
              title: (session && session.title) || t().untitled,
              hint: shortSessionId(key),
              order: order.has(key) ? order.get(key) : Number.MAX_SAFE_INTEGER - 1,
              items: [],
            });
          }
        }
        groups.get(key).items.push(item);
      }
      return [...groups.values()].sort((a, b) => a.order - b.order);
    }

    /** 已完成回合下方的工件条：只列本回合提交/生成的文件，没有就什么都不渲染。 */
    // 工件阅读 tab：自己的地址方案 + 自带 Markdown 排版，绕开原生文档预览的窄排版。
    const READER_PREFIX = 'dsh-resource://artifact/read/';

    function readerAddressFor(sessionId, path) {
      return READER_PREFIX + encodeSegment(sessionId) + '/' + encodePath(String(path).replace(/\\/g, '/'));
    }

    function readerPathOf(address) {
      if (typeof address !== 'string' || !address.startsWith(READER_PREFIX)) return '';
      const rest = address.slice(READER_PREFIX.length);
      const slash = rest.indexOf('/');
      if (slash < 0) return '';
      try {
        return decodeURIComponent(rest.slice(slash + 1));
      } catch {
        return '';
      }
    }

    function readerFileName(path) {
      const parts = String(path).split(/[\\/]/);
      return parts[parts.length - 1] || '';
    }

    function encodeArtifactId(sessionId, path) {
      try {
        const bytes = new TextEncoder().encode(JSON.stringify({ s: sessionId, p: path }));
        let binary = '';
        for (let index = 0; index < bytes.length; index += 8192) {
          binary += String.fromCharCode.apply(null, bytes.subarray(index, index + 8192));
        }
        return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      } catch {
        return '';
      }
    }

    // --- 极简 Markdown → HTML（够阅读用：标题/列表/引用/代码块/表格/链接/行内样式） ---
    function escapeHtmlText(value) {
      return String(value)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function safeHref(url) {
      const value = String(url).trim();
      if (/^(?:javascript|data|vbscript):/i.test(value)) return '#';
      return escapeHtmlText(value);
    }

    function inlineMarkdown(raw) {
      const codes = [];
      let text = escapeHtmlText(raw).replace(/`([^`]+)`/g, (_, code) => {
        codes.push(code);
        return '\u0000' + (codes.length - 1) + '\u0000';
      });
      text = text.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, url) => '<img src="' + safeHref(url) + '" alt="' + alt + '" loading="lazy">');
      text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => '<a href="' + safeHref(url) + '" target="_blank" rel="noreferrer noopener">' + label + '</a>');
      text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      text = text.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
      text = text.replace(/(^|[^_])__([^_]+)__/g, '$1<strong>$2</strong>');
      text = text.replace(/\u0000(\d+)\u0000/g, (_, index) => '<code>' + (codes[Number(index)] || '') + '</code>');
      return text;
    }

    function markdownToHtml(source) {
      const lines = String(source).replace(/\r\n?/g, '\n').split('\n');
      const out = [];
      let index = 0;
      const fence = /^\s*```/;
      while (index < lines.length) {
        const line = lines[index];
        if (fence.test(line)) {
          const language = line.trim().slice(3).trim();
          const body = [];
          index += 1;
          while (index < lines.length && !fence.test(lines[index])) { body.push(escapeHtmlText(lines[index])); index += 1; }
          index += 1;
          out.push('<pre class="dsa-md-code"' + (language ? ' data-lang="' + escapeHtmlText(language) + '"' : '') + '><code>' + body.join('\n') + '</code></pre>');
          continue;
        }
        const heading = line.match(/^\s{0,3}(#{1,6})\s+(.*)$/);
        if (heading !== null) {
          const level = heading[1].length;
          out.push('<h' + level + '>' + inlineMarkdown(heading[2].replace(/\s+#+\s*$/, '')) + '</h' + level + '>');
          index += 1;
          continue;
        }
        if (/^\s{0,3}(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
          out.push('<hr>');
          index += 1;
          continue;
        }
        if (/^\s*>/.test(line)) {
          const body = [];
          while (index < lines.length && /^\s*>/.test(lines[index])) {
            body.push(inlineMarkdown(lines[index].replace(/^\s*>\s?/, '')));
            index += 1;
          }
          out.push('<blockquote><p>' + body.join('<br>') + '</p></blockquote>');
          continue;
        }
        if (line.includes('|') && index + 1 < lines.length && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[index + 1]) && lines[index + 1].includes('-')) {
          const cells = (row) => row.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((cell) => inlineMarkdown(cell.trim()));
          const head = cells(line);
          index += 2;
          const rows = [];
          while (index < lines.length && lines[index].includes('|') && lines[index].trim() !== '') {
            rows.push(cells(lines[index]));
            index += 1;
          }
          out.push('<table><thead><tr>' + head.map((cell) => '<th>' + cell + '</th>').join('') + '</tr></thead><tbody>'
            + rows.map((row) => '<tr>' + row.map((cell) => '<td>' + cell + '</td>').join('') + '</tr>').join('')
            + '</tbody></table>');
          continue;
        }
        if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(line)) {
          const ordered = /^\s*\d+[.)]\s+/.test(line);
          const items = [];
          while (index < lines.length && /^\s*(?:[-*+]|\d+[.)])\s+/.test(lines[index])) {
            items.push('<li>' + inlineMarkdown(lines[index].replace(/^\s*(?:[-*+]|\d+[.)])\s+/, '')) + '</li>');
            index += 1;
          }
          out.push('<' + (ordered ? 'ol' : 'ul') + '>' + items.join('') + '</' + (ordered ? 'ol' : 'ul') + '>');
          continue;
        }
        if (line.trim() === '') {
          index += 1;
          continue;
        }
        const body = [];
        while (index < lines.length && lines[index].trim() !== ''
          && !fence.test(lines[index]) && !/^\s{0,3}#{1,6}\s+/.test(lines[index]) && !/^\s*>/.test(lines[index])) {
          body.push(lines[index]);
          index += 1;
        }
        out.push('<p>' + inlineMarkdown(body.join('\n')) + '</p>');
      }
      return out.join('\n');
    }

    function TurnArtifacts({ turn, seq, sessionId, openFile }) {
      const number = turn && typeof turn.turn === 'number' ? turn.turn : undefined;
      const closed = turn && turn.status === 'closed';
      const [items, setItems] = useState(null);
      const [selected, setSelected] = useState(null);
      const [toast, setToast] = useState('');
      const toastTimer = useRef(0);
      const notify = useCallback((message) => {
        setToast(message);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(''), 1800);
      }, []);
      useEffect(() => () => clearTimeout(toastTimer.current), []);
      useEffect(() => {
        if (!menu) return undefined;
        const onDown = (event) => {
          if (menuRef.current && !menuRef.current.contains(event.target)) setMenu(null);
        };
        const onKey = (event) => { if (event.key === 'Escape') setMenu(null); };
        const onScroll = () => setMenu(null);
        document.addEventListener('pointerdown', onDown, true);
        document.addEventListener('keydown', onKey, true);
        window.addEventListener('scroll', onScroll, true);
        window.addEventListener('resize', onScroll);
        return () => {
          document.removeEventListener('pointerdown', onDown, true);
          document.removeEventListener('keydown', onKey, true);
          window.removeEventListener('scroll', onScroll, true);
          window.removeEventListener('resize', onScroll);
        };
      }, [menu]);
      useEffect(() => {
        if (!selectedId) return;
        const rows = data.items || [];
        const found = rows.some((item) => item.id === selectedId);
        if (!found && !data.loading) setSelectedId('');
      }, [data.items, data.loading, selectedId]);

      useEffect(() => {
        if (!closed || number === undefined || typeof sessionId !== 'string' || sessionId === '') {
          setItems(null);
          return;
        }
        let alive = true;
        let retry = 0;
        const load = () => loadSessionItems(sessionId).then((all) => {
          if (!alive) return;
          const mine = all.filter((item) => item.turn === number);
          if (mine.length === 0 && retry === 0) {
            retry += 1;
            setTimeout(load, 1200);
            return;
          }
          setItems(mine);
        }).catch(() => { if (alive) setItems(null); });
        load();
        return () => { alive = false; };
      }, [closed, number, sessionId, seq]);

      if (!closed || number === undefined || !items || items.length === 0) return null;
      return h(React.Fragment, null,
        h(StyleSheet, null),
        h('div', { className: 'dsa-tail', role: 'group', 'aria-label': t().turnArtifacts },
          h('span', { className: 'dsa-tailHead' }, t().turnArtifacts),
          items.slice(0, 6).map((item) => h('button', {
            key: item.id, className: 'dsa-tailChip', type: 'button', title: item.path,
            onClick: (event) => {
              event.stopPropagation();
              const opened = typeof openFile === 'function' ? openFile(sessionId, undefined, item.path) : false;
              if (!opened) setSelected(item);
            },
          },
            h('span', { className: 'dsa-tailDot', 'aria-hidden': 'true' }, TYPE_LABEL[item.type] || 'FILE'),
            h('span', { className: 'dsa-tailName' }, item.name))),
          items.length > 6 ? h('span', { className: 'dsa-tailHead' }, '+' + (items.length - 6)) : null),
        selected ? h(Detail, {
          id: selected.id, sessionId, workspace: '', onClose: () => setSelected(null), notify,
        }) : null,
        h(Toast, { message: toast }));
    }

    // #region interaction
    const MENU_MARGIN = 8;
    function clampMenuPosition(x, y, width, height, viewportWidth, viewportHeight) {
      const left = Math.max(MENU_MARGIN, Math.min(x, viewportWidth - width - MENU_MARGIN));
      const top = Math.max(MENU_MARGIN, Math.min(y, viewportHeight - height - MENU_MARGIN));
      return { left, top };
    }
    function defaultDirection(key) {
      return key === 'time' ? -1 : 1;
    }
    function nextSortValue(current, key, priorClicks, fallback) {
      if (!current || current.key !== key || priorClicks === 0) return { key, dir: defaultDirection(key) };
      if (priorClicks >= 2) return { ...fallback };
      return { key, dir: -current.dir };
    }
    // #endregion interaction

    function Workbench({ mode, sessionId, openRight, openFile }) {
      const [query, setQuery] = useState('');
      const [debounced, setDebounced] = useState('');
      const [workspace, setWorkspace] = useState('');
      const [detail, setDetail] = useState(null);
      const [toast, setToast] = useState('');
      const toastTimer = useRef(0);

      useEffect(() => {
        const timer = setTimeout(() => setDebounced(query.trim()), 300);
        return () => clearTimeout(timer);
      }, [query]);

      const hideCode = prefs.hideCodeDefault !== false;
      const [scan, setScanOn] = useState(scanState.on);
      useEffect(() => subscribeScan(() => setScanOn(scanState.on)), []);
      const [policy, setPolicyState] = useState(prefs.artifactPolicy === 'explicit' ? 'explicit' : 'writes');
      useEffect(() => subscribePrefs(() => setPolicyState(prefs.artifactPolicy === 'explicit' ? 'explicit' : 'writes')), []);
      const [kindTick, setKindTick] = useState(0);
      useEffect(() => subscribeKinds(() => setKindTick((value) => value + 1)), []);
      const [tagTick, setTagTick] = useState(0);
      useEffect(() => subscribePrefs(() => setTagTick((value) => value + 1)), []);
      const [showPath, setShowPathOn] = useState(showPathState.on);
      useEffect(() => subscribeShowPath(() => setShowPathOn(showPathState.on)), []);
      const [viewMode, setViewModeState] = useState(viewModeState.value);
      useEffect(() => subscribeViewMode(() => {
        const next = viewModeState.value;
        setViewModeState(prefs.disabledViews.includes(next) ? 'details' : next);
      }), []);
      const [fontSize, setFontSizeState] = useState(fontSizeState.value);
      useEffect(() => subscribeFontSize(() => setFontSizeState(fontSizeState.value)), []);
      const [sort, setSort] = useState(() => ({ ...prefs.sort }));
      const sortCycle = useRef({ key: '', step: 0 });
      const [selectedId, setSelectedId] = useState('');
      const [collapsed, setCollapsed] = useState(() => new Set(prefs.collapsedGroups || []));
      const [menu, setMenu] = useState(null);
      const menuRef = useRef(null);
      const [columns, setColumns] = useState(() => normalizeTableColumns(prefs.tableColumns));
      const columnsRef = useRef(columns);
      columnsRef.current = columns;
      useEffect(() => subscribePrefs(() => setColumns(normalizeTableColumns(prefs.tableColumns))), []);
      const [columnMenu, setColumnMenu] = useState(false);
      const scopeOnly = prefs.pathScope !== 'all';
      const commitColumns = (next) => { setColumns(next); columnsRef.current = next; setPref('tableColumns', next); };
      const toggleColumn = (id, visible) => {
        let hidden = visible ? columns.hidden.filter((value) => value !== id) : [...columns.hidden, id];
        if (hidden.length >= columns.order.length) {
          hidden = hidden.filter((value) => value !== id);
          notify(t().columnsMinOne);
        }
        commitColumns({ ...columns, hidden });
      };
      const moveColumn = (id, delta) => {
        const order = [...columns.order];
        const index = order.indexOf(id);
        const target = index + delta;
        if (index < 0 || target < 0 || target >= order.length) return;
        [order[index], order[target]] = [order[target], order[index]];
        commitColumns({ ...columns, order });
      };
      const data = useArtifacts({
        mode, sessionId, workspace: mode === 'workspace' ? workspace : '',
        query: debounced, hideCode, scan, policy,
      });
      useEffect(() => {
        const items = data.items || [];
        if (items.length === 0) return;
        const at = prefs.tagBackfillAt || Date.now();
        const auto = { ...(prefs.autoTags || {}) };
        let changed = false;
        for (const item of items) {
          if (item.category !== 'untagged') continue;
          const legacyItem = !item.firstTime || item.firstTime <= at;
          if (!legacyItem && item.kind !== 'delivered') continue;
          const inferred = inferPurpose(item.path);
          if (auto[item.path] !== inferred) {
            auto[item.path] = inferred;
            changed = true;
          }
        }
        if ((prefs.autoTagsRev || 0) < INFER_REV) {
          setPref('autoTags', auto);
          setPref('artifactTags', {});
          setPref('tagBackfillAt', at);
          setPref('autoTagsRev', INFER_REV);
        } else if (changed) {
          setPref('autoTags', auto);
        }
      }, [data.items]);

      const notify = useCallback((message) => {
        setToast(message);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(''), 1800);
      }, []);
      useEffect(() => () => clearTimeout(toastTimer.current), []);

      const meta = data.meta || { sessions: [], workspaces: [] };
      const facets = data.facets || {};
      const visible = useMemo(() => visibleArtifacts(data.items), [data.items, kindTick, tagTick]);
      const workspaceRoot = mode === 'session'
        ? (((meta.sessions || []).find((entry) => entry.id === sessionId) || {}).cwd || '')
        : (workspace || ((meta.workspaces || [])[0] || ''));
      const scoped = useMemo(
        () => (scopeOnly && workspaceRoot !== '' ? visible.filter((item) => isInsideWorkspace(item.path, workspaceRoot)) : visible),
        [visible, scopeOnly, workspaceRoot],
      );
      const outsideCount = visible.length - scoped.length;
      const groups = useMemo(
        () => groupArtifacts(scoped, meta.sessions, mode, meta.scan, prefs.groupBy),
        [scoped, meta.sessions, mode, meta.scan, prefs.groupBy],
      );

      const openItem = (item) => {
        const owner = item.sessionId || (mode === 'session' ? sessionId : (meta.sessions[0] && meta.sessions[0].id));
        const session = (meta.sessions || []).find((entry) => entry.id === item.sessionId);
        const opened = typeof openFile === 'function' && owner ? openFile(owner, session && session.cwd, item.path) : false;
        if (!opened) setDetail(item);
      };

      const summary = [scoped.length + (data.hasMore ? '+' : '') + ' ' + t().items];
      if (facets.delivered) summary.push(t().delivered + ' ' + facets.delivered);
      if (facets.workspace) summary.push(t().scanGroup + ' ' + facets.workspace);

      const clickSort = (key) => {
        const cycle = sortCycle.current;
        const prior = cycle.key === key ? cycle.step : 0;
        const nextStep = prior >= 2 ? 0 : prior + 1;
        sortCycle.current = { key, step: nextStep };
        setSort((previous) => nextSortValue(previous, key, prior, prefs.sort));
      };

      const sortedItems = (items) => {
        const list = [...items];
        if (sort.key === 'name') list.sort((left, right) => left.name.localeCompare(right.name, language === 'zh' ? 'zh' : 'en') * sort.dir);
        else if (sort.key === 'kind') list.sort((left, right) => categoryLabel(left.category).localeCompare(categoryLabel(right.category)) * sort.dir);
        else list.sort((left, right) => (left.time - right.time) * sort.dir);
        return list;
      };

      const sourceLabel = (item) => {
        const keys = { delivered: 'provDelivered', written: 'provWritten', scan: 'provScan', other: 'provOther' };
        return t()[keys[provenanceOf(item, sessionId)]];
      };

      const toggleGroup = (key) => {
        setCollapsed((current) => {
          const next = new Set(current);
          if (next.has(key)) next.delete(key);
          else next.add(key);
          setPref('collapsedGroups', [...next]);
          return next;
        });
      };
      const rowHandlers = (item) => ({
        onClick: () => setSelectedId(item.id),
        onDoubleClick: () => openItem(item),
        onContextMenu: (event) => {
          event.preventDefault();
          setSelectedId(item.id);
          setMenu({ x: event.clientX, y: event.clientY, item });
        },
        onKeyDown: (event) => {
          if (event.key === 'Enter') openItem(item);
          if (event.key === 'F10' && event.shiftKey) {
            event.preventDefault();
            const rect = event.currentTarget.getBoundingClientRect();
            setSelectedId(item.id);
            setMenu({ x: rect.left + 12, y: rect.bottom - 4, item });
          }
        },
      });
      const renderDetails = (items) => {
        const defs = Object.fromEntries(TABLE_COLUMN_DEFS.map((column) => [column.id, column]));
        const visibleColumns = columns.order.filter((id) => !columns.hidden.includes(id));
        const totalWidth = visibleColumns.reduce((sum, id) => sum + columns.widths[id], 0);
        const startResize = (id) => (event) => {
          event.preventDefault();
          event.stopPropagation();
          const definition = defs[id];
          let lastX = event.clientX;
          let width = columnsRef.current.widths[id];
          const move = (moveEvent) => {
            width = Math.max(definition.min, Math.min(TABLE_COLUMN_MAX, width + (moveEvent.clientX - lastX)));
            lastX = moveEvent.clientX;
            setColumns((current) => ({ ...current, widths: { ...current.widths, [id]: width } }));
          };
          const up = () => {
            document.removeEventListener('pointermove', move);
            document.removeEventListener('pointerup', up);
            const next = { ...columnsRef.current, widths: { ...columnsRef.current.widths, [id]: width } };
            setColumns(next);
            columnsRef.current = next;
            setPref('tableColumns', next);
          };
          document.addEventListener('pointermove', move);
          document.addEventListener('pointerup', up);
        };
        const header = (id) => {
          const definition = defs[id];
          const sortable = id !== 'source' && id !== 'version';
          const arrow = sort.key === id ? (sort.dir === 1 ? ' ▲' : ' ▼') : '';
          return h('th', {
            key: id, scope: 'col', className: 'dsa-col-' + id,
            tabIndex: sortable ? 0 : undefined,
            onClick: sortable ? () => clickSort(id) : undefined,
            onKeyDown: sortable ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); clickSort(id); }
            } : undefined,
            'aria-sort': sortable && sort.key === id ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none',
          },
            h('span', { className: 'dsa-thText' }, t()[definition.label], arrow),
            h('span', {
              className: 'dsa-colResize', role: 'separator', 'aria-orientation': 'vertical',
              'aria-label': t().columns, title: t().columns,
              onPointerDown: startResize(id), onClick: (event) => event.stopPropagation(),
            }));
        };
        const typeTag = (item) => {
          if (item.kind === 'workspace' || item.scanned === true) {
            const tag = typeTagOf(item.path, prefs.fileTypes);
            if (!tag) return h('span', { className: 'dsa-fileTypeTag dsa-fileTypeTagMuted' }, categoryLabel(item.category));
            return h('span', {
              className: 'dsa-fileTypeTag', title: tag.group.label,
              style: { background: tag.tone[0], borderColor: tag.tone[0], color: tag.tone[1] },
            },
              h('span', {
                className: 'dsa-fileTypeIcon', 'aria-hidden': 'true',
                dangerouslySetInnerHTML: { __html: FILE_ICONS[tag.group.icon] || '' },
              }),
              h('span', null, tag.group.label));
          }
          const id = item.category || 'untagged';
          const definition = kindDefinitionOf(id) || { id: 'untagged', labelKey: 'untaggedLabel', descriptionKey: 'kindDescUntagged' };
          const custom = definition.custom === true;
          const tone = (custom && definition.tone) || KIND_TONE[id] || KIND_TONE.untagged;
          return h('span', {
            className: 'dsa-purposeTag' + (id === 'untagged' ? ' dsa-purposeUntagged' : ''),
            title: (custom ? definition.label : t()[definition.descriptionKey])
              + ((!prefs.artifactTags || !prefs.artifactTags[item.path]) && prefs.autoTags && prefs.autoTags[item.path] ? ' · ' + t().inferredTag : ''),
            style: id === 'untagged' ? undefined : { color: tone, borderColor: tone, background: tone + '1f' },
          }, custom ? definition.label : t()[definition.labelKey]);
        };
        const cell = (id, item) => {
          if (id === 'name') {
            return h('td', { key: id }, h('span', { className: 'dsa-cellName' },
              h(FileIcon, { path: item.path, kind: item.category, size: 18 }),
              h('span', { className: 'dsa-cellText' },
                h(MarqueeName, { className: 'dsa-name', text: displayFileName(item.name), title: item.name + ' · ' + item.path }),
                showPath ? h('span', { className: 'dsa-path' }, item.path) : null)));
          }
          if (id === 'kind') return h('td', { key: id }, typeTag(item));
          if (id === 'version') {
            if (item.gitPending) {
              return h('td', { key: id }, h('span', {
                className: 'dsa-version dsa-versionLoading', title: t().gitLoading, 'aria-label': t().gitLoading,
              }, h('span', { className: 'dsa-versionSpinner' })));
            }
            if (item.gitError && !item.git) {
              return h('td', { key: id }, h('button', {
                className: 'dsa-versionRetry', type: 'button', title: t().gitRetry,
                onClick: () => data.retryGit(item.path),
              }, '—'));
            }
            const git = item.git;
            if (!git) {
              const local = item.occurrences || 1;
              const tone = versionTone(local);
              return h('td', { key: id }, h('span', {
                className: 'dsa-version', title: t().localVersion,
                style: { color: tone, borderColor: tone, background: tone + '1a' },
              }, 'v' + local));
            }
            if (!git.tracked || !git.version) return h('td', { key: id }, h('span', { className: 'dsa-version dsa-versionWorking' }, t().workingTree));
            const tone = versionTone(git.version);
            return h('td', { key: id }, h('span', {
              className: 'dsa-version' + (git.dirty ? ' dsa-versionDirty' : ''),
              title: format(t().gitCommits, { n: git.version }) + (git.dirty ? ' · ' + t().dirtyMark : ''),
              style: { color: tone, borderColor: tone, background: tone + '1a' },
            }, 'v' + git.version), git.dirty ? h('span', { className: 'dsa-dirtyMark', title: t().dirtyMark }, 'M') : null);
          }
          if (id === 'time') return h('td', { key: id }, h('span', { className: 'dsa-muted' }, formatTime(item.time)));
          const provenance = provenanceOf(item, sessionId);
          const classes = { delivered: 'dsa-srcDelivered', written: 'dsa-srcWritten', scan: 'dsa-srcScan', other: 'dsa-srcOther' };
          return h('td', { key: id }, h('span', { className: 'dsa-srcTag ' + classes[provenance] }, sourceLabel(item)));
        };
        return h('table', { className: 'dsa-dtable', style: { minWidth: totalWidth + 'px' } },
          h('colgroup', null, visibleColumns.map((id) => h('col', { key: id, style: { width: columns.widths[id] + 'px' } }))),
          h('thead', null, h('tr', null, visibleColumns.map(header))),
          h('tbody', null, items.map((item) => h('tr', {
            key: item.id, tabIndex: 0, title: item.path,
            className: selectedId === item.id ? 'dsa-selected' : undefined,
            ...rowHandlers(item),
          }, visibleColumns.map((id) => cell(id, item))))));
      };

      const renderList = (items) => h('div', { className: 'dsa-listRows' }, items.map((item) => h('button', {
        key: item.id, type: 'button', className: 'dsa-listRow' + (selectedId === item.id ? ' dsa-selected' : ''), title: item.path,
        ...rowHandlers(item),
      },
        h(FileIcon, { path: item.path, kind: item.category, size: 18 }),
        h(MarqueeName, { className: 'dsa-name', text: item.name }),
        showPath ? h('span', { className: 'dsa-listPath' }, item.path) : null)));

      const renderTiles = (items) => h('div', { className: 'dsa-tileGrid' }, items.map((item) => h('button', {
        key: item.id, type: 'button', className: 'dsa-tile' + (selectedId === item.id ? ' dsa-selected' : ''), title: item.path,
        ...rowHandlers(item),
      },
        h('span', { className: 'dsa-tileIcon' }, h(FileIcon, { path: item.path, kind: item.category, size: 28 })),
        h(MarqueeName, { className: 'dsa-tileName', text: item.name }),
        h('span', { className: 'dsa-tileDesc' }, showPath ? item.path : (item.description || '') || '—'),
        h('span', { className: 'dsa-tileMeta' }, categoryLabel(item.category), ' · ', formatTime(item.time)))));

      const renderIcons = (items) => h('div', { className: 'dsa-iconGrid' }, items.map((item) => h('button', {
        key: item.id, type: 'button', className: 'dsa-iconCell' + (selectedId === item.id ? ' dsa-selected' : ''), title: item.path,
        ...rowHandlers(item),
      },
        h(FileIcon, { path: item.path, kind: item.category, size: 36 }),
        h(MarqueeName, { className: 'dsa-iconName', text: item.name }),
        showPath ? h('span', { className: 'dsa-iconPath' }, item.path) : null)));

      const renderContent = (items) => h('div', { className: 'dsa-contentList' }, items.map((item) => h('button', {
        key: item.id, type: 'button', className: 'dsa-contentRow' + (selectedId === item.id ? ' dsa-selected' : ''), title: item.path,
        ...rowHandlers(item),
      },
        h(FileIcon, { path: item.path, kind: item.category, size: 24 }),
        h('span', { className: 'dsa-contentBody' },
          h(MarqueeName, { className: 'dsa-contentName', text: item.name }),
          h('span', { className: 'dsa-contentDesc' }, showPath ? item.path : (item.description || '') || '—')),
        h('span', { className: 'dsa-contentMeta' }, categoryLabel(item.category), h('span', { className: 'dsa-muted' }, formatTime(item.time))))));

      const renderBody = (items) => {
        const ordered = sortedItems(items);
        if (viewMode === 'list') return renderList(ordered);
        if (viewMode === 'tiles') return renderTiles(ordered);
        if (viewMode === 'icons') return renderIcons(ordered);
        if (viewMode === 'content') return renderContent(ordered);
        return renderDetails(ordered);
      };

      const viewOptions = [
        ['details', t().viewDetails], ['list', t().viewList], ['tiles', t().viewTiles],
        ['icons', t().viewIcons], ['content', t().viewContent],
      ].filter(([key]) => !prefs.disabledViews.includes(key));

      return h('div', { className: 'dsa-page', 'data-font': fontSize },
        h(StyleSheet, null),
        h('div', { className: 'dsa-header' },
          h('div', { className: 'dsa-headText' },
            h('h1', { className: 'dsa-title' }, t().title,
              meta.version ? h('span', {
                className: 'dsa-versionChip' + (meta.version === PLUGIN_VERSION ? '' : ' dsa-versionWarn'),
                title: meta.version === PLUGIN_VERSION
                  ? 'dsh-agent-artifacts ' + meta.version
                  : format(t().versionMismatch, { client: PLUGIN_VERSION, host: meta.version }),
              }, h('i'), meta.version === PLUGIN_VERSION ? meta.version : PLUGIN_VERSION) : null),
            h('span', { className: 'dsa-count', title: summary.join(' · ') }, summary.join(' · '))),
          typeof openRight === 'function' ? h('button', {
            className: 'dsa-button',
            onClick: () => {
              const target = mode === 'session' ? sessionId : (meta.sessions[0] && meta.sessions[0].id);
              if (target) openRight(target);
            },
            title: t().openRight, 'aria-label': t().openRight,
          }, t().openRight) : null,
          h('button', {
            className: 'dsa-iconButton', onClick: data.refresh, title: t().refresh, 'aria-label': t().refresh,
          }, '⟳')),
        h('div', { className: 'dsa-controls' },
          h('div', { className: 'dsa-toolbar' },
            h('input', {
              className: 'dsa-input', type: 'search', value: query, placeholder: t().search,
              'aria-label': t().search, onChange: (event) => setQuery(event.target.value),
            }),
            mode === 'workspace' ? h('select', {
              className: 'dsa-select', value: workspace, 'aria-label': t().autoWorkspace,
              onChange: (event) => setWorkspace(event.target.value),
            },
              h('option', { value: '' }, t().autoWorkspace),
              (meta.workspaces || []).map((value) => h('option', { key: value, value }, value))) : null),
          h('div', { className: 'dsa-controlBar' },
            h('div', { className: 'dsa-seg', role: 'group', 'aria-label': t().groupByLabel },
              [['purpose', t().groupByPurpose], ['file', t().groupByFile], ['session', t().groupBySession]].map(([id, label]) => h('button', {
                key: id, type: 'button', className: 'dsa-iconSegBtn', title: label, 'aria-label': label,
                'aria-pressed': prefs.groupBy === id,
                onClick: () => setPref('groupBy', id),
              }, h(ControlIcon, { paths: GROUP_ICONS[id] })))),
            h('span', { className: 'dsa-segLine', 'aria-hidden': 'true' }),
            h('div', { className: 'dsa-seg', role: 'group', 'aria-label': t().viewModeLabel },
              viewOptions.map(([key, label]) => h('button', {
                key, type: 'button', className: 'dsa-iconSegBtn', title: label, 'aria-label': label,
                'aria-pressed': viewMode === key,
                onClick: () => setViewMode(key),
              }, h(ControlIcon, { paths: VIEW_ICONS[key] })))),
            h('div', { className: 'dsa-colMenuWrap' },
              h('button', {
                className: 'dsa-colBtn', type: 'button', 'aria-expanded': columnMenu,
                title: t().columns, 'aria-label': t().columns,
                onClick: () => setColumnMenu((value) => !value),
              }, h(ControlIcon, { paths: ['M4 4h16v16H4z', 'M10 4v16', 'M16 4v16'] })),
              columnMenu ? h('div', { className: 'dsa-colMenu' },
                h('div', { className: 'dsa-colMenuTitle' }, t().columnsHint),
                columns.order.map((id, index) => {
                  const definition = TABLE_COLUMN_DEFS.find((column) => column.id === id);
                  return h('div', { key: id, className: 'dsa-colMenuRow' },
                    h('label', null,
                      h('input', {
                        type: 'checkbox', checked: !columns.hidden.includes(id),
                        onChange: (event) => toggleColumn(id, event.target.checked),
                      }),
                      t()[definition.label]),
                    h('button', {
                      className: 'dsa-colMove', type: 'button', disabled: index === 0,
                      'aria-label': t().columnsHint, onClick: () => moveColumn(id, -1),
                    }, '↑'),
                    h('button', {
                      className: 'dsa-colMove', type: 'button', disabled: index === columns.order.length - 1,
                      'aria-label': t().columnsHint, onClick: () => moveColumn(id, 1),
                    }, '↓'));
                }),
                h('button', {
                  className: 'dsa-colReset', type: 'button',
                  onClick: () => { commitColumns(defaultTableColumns()); setColumnMenu(false); },
                }, t().columnsReset)) : null))),
        h('div', { className: 'dsa-list', role: 'list', 'data-compact': showPath ? 'false' : 'true', 'data-density': prefs.density === 'compact' ? 'compact' : 'comfortable' },
          data.error ? h('div', { className: 'dsa-error' },
            h('div', null, t().error + '：' + data.error),
            h('div', { style: { marginTop: 8 } },
              h('button', { className: 'dsa-button', onClick: data.reload }, t().retry))) : null,
          data.loading && scoped.length === 0 ? h('div', { className: 'dsa-loading' }, t().loading) : null,
          !data.loading && !data.error && scoped.length === 0
            ? h('div', { className: 'dsa-empty' }, t().empty) : null,
          !data.loading && !data.error && outsideCount > 0 && scopeOnly
            ? h('div', { className: 'dsa-scopeHint' },
              h('span', null, (scoped.length === 0 ? t().scopeEmptyHint : format(t().scopeInsideHint, { n: scoped.length }))
                + ' ' + outsideCount + ' ' + t().scopeOutside),
              h('button', {
                className: 'dsa-button', type: 'button',
                onClick: () => setPref('pathScope', 'all'),
              }, t().scopeShowAll)) : null,
          groups.map((group) => h('section', { key: group.key, className: 'dsa-groupBlock', role: 'group' },
            h('button', {
              type: 'button', className: 'dsa-group dsa-groupToggle',
              'aria-expanded': !collapsed.has(group.key),
              onClick: () => toggleGroup(group.key),
            },
            h('span', { className: 'dsa-groupChevron', 'aria-hidden': 'true' }, collapsed.has(group.key) ? '▸' : '▾'),
              group.kind ? h('span', { className: 'dsa-groupIcon' }, h(KindIcon, { kind: group.kind, size: 18 })) : null,
              group.fileType ? h('span', {
                className: 'dsa-ficon dsa-groupIcon', 'aria-hidden': 'true',
                dangerouslySetInnerHTML: { __html: FILE_ICONS[group.fileType.icon] || FILE_ICONS.document || '' },
                style: { width: '18px', height: '18px' },
              }) : null,
              h('span', { className: 'dsa-groupTitle', title: group.title }, group.title),
              group.hint ? h('span', { className: 'dsa-groupHint', title: group.hint }, group.hint) : null,
              h('span', { className: 'dsa-groupCount' }, String(group.items.length))),
            collapsed.has(group.key) ? null : renderBody(group.items))),
          data.hasMore ? h('div', { className: 'dsa-more' },
            h('button', { className: 'dsa-button', onClick: data.loadMore, disabled: data.loading },
              data.loading ? t().loading : t().loadMore)) : null),
        detail ? h(Detail, {
          id: detail.id, workspace: mode === 'workspace' ? workspace : '', sessionId,
          onClose: () => setDetail(null), notify,
        }) : null,
        menu ? (() => {
          const position = clampMenuPosition(menu.x, menu.y, 190, 148, window.innerWidth, window.innerHeight);
          const close = () => setMenu(null);
          const reveal = () => {
            request('reveal', { path: menu.item.path }).then(() => notify(t().revealed)).catch((error) => notify(String(error.message || error) || t().revealFailed));
            close();
          };
          return h('div', {
            ref: menuRef, className: 'dsa-menu', role: 'menu', 'aria-label': t().turnArtifacts,
            style: { left: position.left + 'px', top: position.top + 'px' },
          },
            h('button', { type: 'button', role: 'menuitem', onClick: () => { openItem(menu.item); close(); } }, t().menuOpen),
            h('button', { type: 'button', role: 'menuitem', onClick: () => { setDetail(menu.item); close(); } }, t().menuDetail),
            h('button', { type: 'button', role: 'menuitem', onClick: () => { navigator.clipboard.writeText(menu.item.path).then(() => notify(t().copied)).catch(() => notify(t().copyFailed)); close(); } }, t().menuCopyPath),
            h('button', { type: 'button', role: 'menuitem', onClick: reveal }, t().menuReveal));
        })() : null,
        h(Toast, { message: toast }));
    }

    function WorkspacePage(props) {
      return h(Workbench, {
        mode: 'workspace', openRight: props && props.openRight, openFile: props && props.openFile,
      });
    }

    function SessionView(props) {
      return h(Workbench, {
        mode: 'session', sessionId: props && props.sessionId,
        openRight: props && props.openRight, openFile: props && props.openFile,
      });
    }

    function RightArtifacts(props) {
      return h(Workbench, {
        mode: 'session', sessionId: props && props.sessionId,
        openFile: props && props.openFile,
      });
    }

    const PLUGIN_VERSION = '2.18.0';
    const TAB_LABELS = { entry: 'tabEntry', content: 'tabContent', filetypes: 'tabFileTypes', display: 'tabDisplay', about: 'tabAbout' };

    function PrefSwitch({ label, hint, checked, onChange }) {
      return h('div', { className: 'dsa-setRow dsa-prefRow' },
        h('div', { className: 'dsa-kindText' },
          h('span', { className: 'dsa-kindName' }, label),
          hint ? h('span', { className: 'dsa-kindDesc', title: hint }, hint) : null),
        h('label', { className: 'dsa-switch' },
          h('input', {
            type: 'checkbox', checked: checked === true, 'aria-label': label,
            onChange: (event) => onChange(event.target.checked),
          }),
          h('i', { 'aria-hidden': 'true' })));
    }

    function SettingsEntry() {
      const rows = [
        ['rail', t().locRail, t().locRailHint],
        ['guide', t().locGuide, t().locGuideHint],
        ['turnTail', t().locTail, t().locTailHint],
        ['sessionView', t().locSession, t().locSessionHint],
      ];
      const anyOn = rows.some(([key]) => prefs.entries[key]);
      return h('div', null,
        h('h3', { className: 'dsa-setTitle' }, t().tabEntry),
        h('p', { className: 'dsa-setHint' }, t().locationHint),
        rows.map(([key, label, hint]) => h(PrefSwitch, {
          key, label, hint,
          checked: prefs.entries[key],
          onChange: (value) => setLocation(key, value),
        })),
        anyOn ? null : h('p', { className: 'dsa-warn' }, t().noEntryWarning),
        h('div', { className: 'dsa-resetRow' },
          h('button', { className: 'dsa-button', onClick: () => resetPrefs('entry') }, t().settingsReset)));
    }

    function SettingsContent() {
      return h('div', null,
        h('h3', { className: 'dsa-setTitle' }, t().tabContent),
        h('p', { className: 'dsa-setHint' }, t().scanHint),
        h(PrefSwitch, {
          label: t().scanToggle, hint: t().scanHint,
          checked: prefs.scan, onChange: setScan,
        }),
        h(PrefSwitch, {
          label: t().strictPolicy, hint: t().strictPolicyHint,
          checked: prefs.artifactPolicy === 'explicit',
          onChange: (value) => setPref('artifactPolicy', value ? 'explicit' : 'writes'),
        }),
        h(PrefSwitch, {
          label: t().hideCodeDefault, hint: t().hideCodeDefaultHint,
          checked: prefs.hideCodeDefault, onChange: (value) => setPref('hideCodeDefault', value),
        }),
        h(PrefSwitch, {
          label: t().scopeOnly, hint: t().scopeOnlyHint,
          checked: prefs.pathScope === 'workspace',
          onChange: (value) => setPref('pathScope', value ? 'workspace' : 'all'),
        }),
        h(PrefSwitch, {
          label: t().viewTilesEnable, hint: t().viewDisableHint,
          checked: !prefs.disabledViews.includes('tiles'),
          onChange: (value) => {
            if (value) setPref('disabledViews', prefs.disabledViews.filter((id) => id !== 'tiles'));
            else {
              if (prefs.view === 'tiles') setPref('view', 'details');
              setPref('disabledViews', [...new Set([...prefs.disabledViews, 'tiles'])]);
            }
          },
        }),
        h(PrefSwitch, {
          label: t().viewContentEnable, hint: t().viewDisableHint,
          checked: !prefs.disabledViews.includes('content'),
          onChange: (value) => {
            if (value) setPref('disabledViews', prefs.disabledViews.filter((id) => id !== 'content'));
            else {
              if (prefs.view === 'content') setPref('view', 'details');
              setPref('disabledViews', [...new Set([...prefs.disabledViews, 'content'])]);
            }
          },
        }),
        h('p', { className: 'dsa-setHint' }, t().scanLimit),
        h('div', { className: 'dsa-resetRow' },
          h('button', { className: 'dsa-button', onClick: () => resetPrefs('content') }, t().settingsReset)));
    }

    function SettingsFileTypes() {
      const [, tick] = useState(0);
      useEffect(() => subscribePrefs(() => tick((value) => value + 1)), []);
      const [view, setView] = useState('kinds');
      const [query, setQuery] = useState('');
      const [editor, setEditor] = useState(null);
      const [iconDialog, setIconDialog] = useState(null);
      const [kindEditor, setKindEditor] = useState(null);
      const [kindIconDialog, setKindIconDialog] = useState(null);
      const [kindIconQuery, setKindIconQuery] = useState('');
      const [iconQuery, setIconQuery] = useState('');
      const [notice, setNotice] = useState('');
      const groups = prefs.fileTypes || defaultTypeGroups(language);
      const hidden = prefs.hiddenKinds;
      const extensionTotal = groups.reduce((total, group) => total + (group.extensions || []).length, 0);
      const iconNode = (id, size) => h('span', {
        className: 'dsa-previewIcon', 'aria-hidden': 'true', style: { width: size, height: size },
        dangerouslySetInnerHTML: { __html: FILE_ICONS[id] || '' },
      });
      const matches = (group) => {
        const needle = query.trim().toLowerCase();
        if (needle === '') return true;
        return group.label.toLowerCase().includes(needle)
          || group.icon.includes(needle)
          || (group.extensions || []).some((extension) => ('.' + extension).includes(needle))
          || (group.specials || []).some((special) => special.toLowerCase().includes(needle));
      };
      const filtered = groups.filter(matches);
      const commit = (next, message) => { setPref('fileTypes', next); setNotice(message); };
      const openEditor = (id) => {
        const existing = id ? groups.find((group) => group.id === id) : null;
        setEditor(existing
          ? {
            id: existing.id, label: existing.label, icon: existing.icon,
            extensions: (existing.extensions || []).slice(), specials: (existing.specials || []).slice(),
            builtin: existing.builtin, isNew: false, draftExt: '', draftSpecial: '',
          }
          : {
            id: 'custom-' + Date.now().toString(36), label: '', icon: 'document',
            extensions: [], specials: [], builtin: false, isNew: true, draftExt: '', draftSpecial: '',
          });
      };
      const updateEditor = (patch) => setEditor((current) => (current ? { ...current, ...patch } : current));
      const addChip = (field, value) => {
        const text = String(value || '').trim();
        if (text === '') return;
        if (field === 'extensions') {
          const extension = text.replace(/^\./, '').toLowerCase();
          if (extension === '') return;
          setEditor((current) => current && !current.extensions.includes(extension)
            ? { ...current, extensions: [...current.extensions, extension], draftExt: '' }
            : current);
        } else {
          const special = text;
          setEditor((current) => current && !current.specials.some((entry) => entry.toLowerCase() === special.toLowerCase())
            ? { ...current, specials: [...current.specials, special], draftSpecial: '' }
            : current);
        }
      };
      const saveEditor = () => {
        if (!editor) return;
        const label = editor.label.trim();
        if (label === '') { setNotice(t().ftNameRequired); return; }
        const next = groups.map((group) => ({
          ...group, extensions: (group.extensions || []).slice(), specials: (group.specials || []).slice(),
        }));
        let target = next.find((group) => group.id === editor.id);
        if (!target) {
          target = { id: editor.id, label, icon: editor.icon, extensions: [], specials: [], builtin: false };
          next.push(target);
        }
        const extensions = editor.extensions.map((value) => value.replace(/^\./, '').toLowerCase()).filter(Boolean);
        const specials = editor.specials.map((value) => value.trim()).filter(Boolean);
        const extensionSet = new Set(extensions);
        const specialSet = new Set(specials.map((value) => value.toLowerCase()));
        for (const group of next) {
          if (group === target) continue;
          group.extensions = (group.extensions || []).filter((value) => !extensionSet.has(value));
          group.specials = (group.specials || []).filter((value) => !specialSet.has(value.toLowerCase()));
        }
        target.label = label;
        target.icon = editor.icon;
        target.extensions = extensions;
        target.specials = specials;
        if (next.length > MAX_TYPE_GROUPS || next.reduce((total, group) => total + group.extensions.length, 0) > MAX_TYPE_EXTENSIONS) {
          setNotice(t().ftLimit);
          return;
        }
        setEditor(null);
        commit(next, editor.isNew ? t().ftCreated : t().ftSaved);
      };
      const applyIcon = (id, icon) => {
        commit(groups.map((group) => (group.id === id ? { ...group, icon } : group)), t().ftIconDone);
      };
      const removeGroup = (id) => {
        commit(groups.filter((group) => group.id !== id), t().ftDeleted);
      };
      const iconChoices = Object.keys(FILE_ICONS).sort().filter((id) => iconQuery.trim() === '' || id.includes(iconQuery.trim().toLowerCase()));
      const samples = ['README.md', 'app.foo', 'demo.mp3', 'package.json', 'shot.png', 'weird.bin'];

      const renderGroups = () => h('div', null,
        h('div', { className: 'dsa-ftToolbar' },
          h('input', {
            className: 'dsa-input', type: 'search', value: query, placeholder: t().ftSearch,
            'aria-label': t().ftSearch, onChange: (event) => setQuery(event.target.value),
          }),
          h('span', { className: 'dsa-count' }, `${filtered.length} / ${groups.length} ${t().ftTypeCol} · ${extensionTotal} ${t().mapExt}`),
          h('span', { className: 'dsa-ftSpacer' }),
          notice ? h('span', { className: 'dsa-warn' }, notice) : null,
          h('button', { className: 'dsa-button', type: 'button', onClick: () => openEditor(null) }, t().ftNew),
          h('button', { className: 'dsa-button', type: 'button', onClick: () => commit(null, t().ftResetDone) }, t().ftReset)),
        h('div', { className: 'dsa-mapScroll' },
          h('table', { className: 'dsa-mapTable dsa-typeTable' },
            h('thead', null, h('tr', null,
              h('th', { className: 'dsa-colTypeIcon' }, t().mapIconCol),
              h('th', { className: 'dsa-colTypeName' }, t().ftTypeCol),
              h('th', null, t().ftMembers),
              h('th', { className: 'dsa-colTypeActions' }, t().ftActions))),
            h('tbody', null, filtered.length === 0
              ? h('tr', null, h('td', { colSpan: 4 }, h('div', { className: 'dsa-empty' }, t().ftNoMatch)))
              : filtered.map((group) => h('tr', { key: group.id },
                h('td', null, iconNode(group.icon, 24)),
                h('td', null,
                  h('div', { className: 'dsa-typeName' },
                    h('span', null, group.label),
                    h('span', { className: 'dsa-typeTag' }, group.builtin ? t().ftBuiltin : t().ftCustom)),
                  h('div', { className: 'dsa-mono muted' }, group.id)),
                h('td', null, (group.extensions || []).length === 0 && (group.specials || []).length === 0
                  ? h('span', { className: 'muted' }, t().ftNoMembers)
                  : h('div', { className: 'dsa-members' },
                    (group.extensions || []).length > 0
                      ? h('div', { className: 'dsa-chips' }, group.extensions.map((extension) => h('span', { key: extension, className: 'dsa-chip' }, '.' + extension)))
                      : null,
                    (group.specials || []).length > 0
                      ? h('div', { className: 'dsa-chips' }, group.specials.map((special) => h('span', { key: special, className: 'dsa-chip dsa-chipSpecial' }, special)))
                      : null)),
                h('td', null, h('div', { className: 'dsa-rowActions' },
                  h('button', { className: 'dsa-button', type: 'button', onClick: () => { setIconDialog(group.id); setIconQuery(''); } }, t().ftChangeIcon),
                  h('button', { className: 'dsa-button', type: 'button', onClick: () => openEditor(group.id) }, t().ftEdit),
                  h('button', { className: 'dsa-button dsa-danger', type: 'button', onClick: () => removeGroup(group.id) }, t().ftDelete)))))))),
        h('h4', { className: 'dsa-kindGroupTitle', style: { marginTop: '16px' } }, t().ftPreview),
        h('p', { className: 'dsa-setHint' }, t().ftPreviewHint),
        h('div', { className: 'dsa-ovList' }, samples.map((sample) => {
          const resolved = resolveTypeGroup(sample, groups);
          return h('div', { key: sample, className: 'dsa-ovRow' },
            resolved.group ? iconNode(resolved.group.icon, 20) : h(KindIcon, { kind: 'other', size: 20 }),
            h('span', { className: 'dsa-kindName' }, sample),
            h('span', { className: 'dsa-count' }, resolved.group ? resolved.group.label + ' · ' + resolved.source : t().iconsSourceFallback));
        })));

      const kindDefs = () => kindDefinitions();
      const kindIconNode = (kind, size) => h(KindIcon, { kind, size });
      const customKind = (id) => (prefs.artifactKinds || []).find((kind) => kind.id === id) || null;
      const openKindEditor = (id) => {
        const existing = id ? customKind(id) : null;
        setKindEditor(existing
          ? { ...existing, isNew: false }
          : { id: 'custom-' + Date.now().toString(36), label: '', icon: 'document', tone: KIND_TONE_PALETTE[0], custom: true, isNew: true });
      };
      const saveKindEditor = () => {
        if (!kindEditor) return;
        const label = kindEditor.label.trim().slice(0, 20);
        if (label === '') { setNotice(t().kindNameRequired); return; }
        const next = [...(prefs.artifactKinds || [])];
        const target = { ...kindEditor, label, custom: true };
        delete target.isNew;
        const index = next.findIndex((kind) => kind.id === target.id);
        if (index < 0) {
          if (next.length >= MAX_ARTIFACT_KINDS) { setNotice(t().kindLimit); return; }
          next.push(target);
        } else {
          next[index] = target;
        }
        setKindEditor(null);
        setPref('artifactKinds', next);
        setNotice(t().kindSaved);
      };
      const applyKindIcon = (id, icon) => {
        setPref('kindIcons', { ...(prefs.kindIcons || {}), [id]: icon });
        setKindIconDialog(null);
        setNotice(t().kindSaved);
      };
      const resetKindIcon = (id) => {
        const next = { ...(prefs.kindIcons || {}) };
        delete next[id];
        setPref('kindIcons', next);
      };
      const removeKind = (id) => {
        if (typeof window !== 'undefined' && !window.confirm(t().kindDeleteConfirm)) return;
        const tags = { ...(prefs.artifactTags || {}) };
        for (const [path, tag] of Object.entries(tags)) if (tag === id) delete tags[path];
        const auto = { ...(prefs.autoTags || {}) };
        for (const [path, tag] of Object.entries(auto)) if (tag === id) delete auto[path];
        const hidden = prefs.hiddenKinds.filter((entry) => entry !== id);
        const icons = { ...(prefs.kindIcons || {}) };
        delete icons[id];
        setPref('artifactKinds', (prefs.artifactKinds || []).filter((kind) => kind.id !== id));
        setPref('kindIcons', icons);
        setPref('hiddenKinds', hidden);
        setPref('artifactTags', tags);
        setPref('autoTags', auto);
        setNotice(t().kindDeleted);
      };
      const renderKinds = () => {
        const hiddenIds = new Set(prefs.hiddenKinds);
        const kindRow = (kind) => {
          const custom = kind.custom === true;
          const description = custom ? t().kindCustomTag : (KIND_RULES[kind.id] ? t()[KIND_RULES[kind.id]] : t().kindDescOther);
          return h('tr', { key: kind.id },
            h('td', null, h('div', { className: 'dsa-kindCell' }, kindIconNode(kind.id, 22),
              h('span', { className: 'dsa-kindName' }, kind.custom ? kind.label : t()[kind.labelKey]))),
            h('td', null, h('span', { className: 'dsa-kindDesc' }, description)),
            h('td', { className: 'dsa-colRules' }, h('span', { className: 'dsa-mono muted' }, kind.id)),
            h('td', null, h('div', { className: 'dsa-rowActions' },
              h('button', { className: 'dsa-button', type: 'button', onClick: () => { setKindIconDialog(kind.id); setKindIconQuery(''); } }, t().kindIcon),
              custom ? h('button', { className: 'dsa-button', type: 'button', onClick: () => openKindEditor(kind.id) }, t().kindEdit) : null,
              custom ? h('button', { className: 'dsa-button dsa-danger', type: 'button', onClick: () => removeKind(kind.id) }, t().kindDelete) : null,
              (prefs.kindIcons && prefs.kindIcons[kind.id]) ? h('button', { className: 'dsa-button', type: 'button', onClick: () => resetKindIcon(kind.id) }, t().kindResetIcon) : null)),
            h('td', null, h('label', { className: 'dsa-switch' },
              h('input', {
                type: 'checkbox', checked: !hiddenIds.has(kind.id), 'aria-label': kind.custom ? kind.label : t()[kind.labelKey],
                onChange: (event) => setKindVisible(kind.id, event.target.checked),
              }),
              h('i', { 'aria-hidden': 'true' }))));
        };
        return h('div', null,
          h('div', { className: 'dsa-mapScroll' },
            h('table', { className: 'dsa-mapTable dsa-typeTable' },
              h('thead', null, h('tr', null,
                h('th', { className: 'dsa-colKindCell' }, t().mapKindCol),
                h('th', { className: 'dsa-colRules' }, t().mapRules),
                h('th', null, 'ID'),
                h('th', { className: 'dsa-colTypeActions' }, t().ftActions),
                h('th', { className: 'dsa-colSwitch' }, t().mapShow))),
              h('tbody', null, kindDefs().map(kindRow)))),
          h('button', { className: 'dsa-button', type: 'button', style: { marginTop: '8px' }, onClick: () => openKindEditor(null) }, t().kindNew),
          h('p', { className: 'dsa-setHint' }, t().mapKindsFooter),
          h('div', { className: 'dsa-resetRow' },
            h('span', { className: 'dsa-count' }, hiddenIds.size === 0 ? t().typesAllVisible : `${t().typesHidden} ${hiddenIds.size} / ${kindDefs().length}`),
            h('button', { className: 'dsa-button', onClick: () => resetPrefs('types') }, t().settingsReset)));
      };

      const renderKindEditor = () => {
        if (!kindEditor) return null;
        const iconPreview = (id) => h('span', {
          className: 'dsa-previewIcon', style: { width: '22px', height: '22px' },
          dangerouslySetInnerHTML: { __html: FILE_ICONS[id] || FILE_ICONS.document || '' },
        });
        return h('div', { className: 'dsa-overlay', role: 'presentation', onClick: () => setKindEditor(null) },
          h('div', { className: 'dsa-modal', role: 'dialog', 'aria-modal': 'true', style: { width: 'min(560px, 92vw)' }, onClick: (event) => event.stopPropagation() },
            h('div', { className: 'dsa-modalHead' },
              h(KindIcon, { kind: kindEditor.id, size: 30 }),
              h('div', { style: { minWidth: 0 } },
                h('h3', { className: 'dsa-modalTitle' }, kindEditor.isNew ? t().kindNew : t().kindEdit),
                h('div', { className: 'dsa-modalPath' }, kindEditor.id))),
            h('div', { className: 'dsa-modalBody' },
              h('div', { className: 'dsa-field' },
                h('label', null, t().ftName),
                h('input', {
                  className: 'dsa-input', maxLength: 20, value: kindEditor.label, placeholder: t().ftNamePlaceholder,
                  'aria-label': t().ftName, onChange: (event) => setKindEditor((current) => ({ ...current, label: event.target.value })),
                })),
              h('div', { className: 'dsa-field' },
                h('label', null, t().ftIconLabel),
                h('div', { className: 'dsa-iconGrid', role: 'listbox', 'aria-label': t().ftIconLabel },
                  Object.keys(FILE_ICONS).sort().map((id) => h('button', {
                    key: id, type: 'button', role: 'option', title: id,
                    className: 'dsa-iconCell', 'aria-pressed': kindEditor.icon === id,
                    onClick: () => setKindEditor((current) => ({ ...current, icon: id })),
                  }, iconPreview(id), h('span', null, id))))),
              h('div', { className: 'dsa-field' },
                h('label', null, t().kindTone),
                h('div', { className: 'dsa-chips' }, KIND_TONE_PALETTE.map((tone) => h('button', {
                  key: tone, type: 'button', 'aria-label': tone,
                  className: 'dsa-toneDot' + (kindEditor.tone === tone ? ' on' : ''),
                  style: { background: tone }, onClick: () => setKindEditor((current) => ({ ...current, tone })),
                }))))),
            h('div', { className: 'dsa-modalActions', style: { justifyContent: 'flex-end' } },
              h('button', { className: 'dsa-button', type: 'button', onClick: () => setKindEditor(null) }, t().dialogCancel),
              h('button', { className: 'dsa-button dsa-primary', type: 'button', onClick: saveKindEditor }, t().dialogSave))));
      };

      const renderKindIconDialog = () => {
        if (!kindIconDialog) return null;
        const kind = kindDefs().find((entry) => entry.id === kindIconDialog);
        const choices = Object.keys(FILE_ICONS).sort().filter((id) => kindIconQuery.trim() === '' || id.includes(kindIconQuery.trim().toLowerCase()));
        return h('div', { className: 'dsa-overlay', role: 'presentation', onClick: () => setKindIconDialog(null) },
          h('div', { className: 'dsa-modal', role: 'dialog', 'aria-modal': 'true', style: { width: 'min(520px, 92vw)' }, onClick: (event) => event.stopPropagation() },
            h('div', { className: 'dsa-modalHead' },
              h(KindIcon, { kind: kindIconDialog, size: 30 }),
              h('div', { style: { minWidth: 0 } },
                h('h3', { className: 'dsa-modalTitle' }, t().kindIconTitle + (kind ? ' · ' + (kind.custom ? kind.label : t()[kind.labelKey]) : '')),
                h('div', { className: 'dsa-modalPath' }, kindIconDialog))),
            h('div', { className: 'dsa-modalBody' },
              h('input', {
                className: 'dsa-input', type: 'search', value: kindIconQuery, placeholder: t().iconsSearch,
                'aria-label': t().iconsSearch, onChange: (event) => setKindIconQuery(event.target.value),
              }),
              h('div', { className: 'dsa-iconGrid', role: 'listbox', 'aria-label': t().iconsSearch },
                choices.map((id) => h('button', {
                  key: id, type: 'button', role: 'option', title: id,
                  className: 'dsa-iconCell', 'aria-pressed': prefs.kindIcons && prefs.kindIcons[kindIconDialog] === id,
                  onClick: () => applyKindIcon(kindIconDialog, id),
                }, h('span', { className: 'dsa-previewIcon', 'aria-hidden': 'true', style: { width: '22px', height: '22px' }, dangerouslySetInnerHTML: { __html: FILE_ICONS[id] || '' } }), h('span', null, id))))),
            h('div', { className: 'dsa-modalActions', style: { justifyContent: 'flex-end' } },
              h('button', { className: 'dsa-button', type: 'button', onClick: () => setKindIconDialog(null) }, t().dialogCancel))));
      };

      const renderEditor = () => {
        if (!editor) return null;
        const chipBox = (field, label, placeholder, value, special) => h('div', { className: 'dsa-field' },
          h('label', null, label),
          h('div', { className: 'dsa-chipsBox' },
            (special ? editor.specials : editor.extensions).map((entry) => h('span', { key: entry, className: special ? 'dsa-chip dsa-chipSpecial' : 'dsa-chip' },
              entry,
              h('button', {
                type: 'button', 'aria-label': 'remove ' + entry,
                onClick: () => updateEditor({ [field]: (special ? editor.specials : editor.extensions).filter((value2) => value2 !== entry) }),
              }, '×'))),
            h('input', {
              value, placeholder, 'aria-label': placeholder,
              onChange: (event) => updateEditor({ [special ? 'draftSpecial' : 'draftExt']: event.target.value }),
              onKeyDown: (event) => {
                if (event.key !== 'Enter' && event.key !== ',') return;
                event.preventDefault();
                addChip(field, event.target.value);
              },
            })));
        return h('div', { className: 'dsa-overlay', role: 'presentation', onClick: () => setEditor(null) },
          h('div', { className: 'dsa-modal', role: 'dialog', 'aria-modal': 'true', style: { width: 'min(560px, 92vw)' }, onClick: (event) => event.stopPropagation() },
            h('div', { className: 'dsa-modalHead' },
              iconNode(editor.icon, 30),
              h('div', { style: { minWidth: 0 } },
                h('h3', { className: 'dsa-modalTitle' }, editor.isNew ? t().ftNew : t().ftEdit),
                h('div', { className: 'dsa-modalPath' }, editor.id))),
            h('div', { className: 'dsa-modalBody' },
              h('div', { className: 'dsa-field' },
                h('label', null, t().ftName),
                h('input', {
                  className: 'dsa-input', value: editor.label, placeholder: t().ftNamePlaceholder,
                  'aria-label': t().ftName, onChange: (event) => updateEditor({ label: event.target.value }),
                })),
              h('div', { className: 'dsa-field' },
                h('label', null, t().ftIconLabel),
                h('div', { className: 'dsa-iconGrid', role: 'listbox', 'aria-label': t().ftIconLabel },
                  Object.keys(FILE_ICONS).sort().map((id) => h('button', {
                    key: id, type: 'button', role: 'option', title: id,
                    className: 'dsa-iconCell', 'aria-pressed': editor.icon === id,
                    onClick: () => updateEditor({ icon: id }),
                  }, iconNode(id, 22), h('span', null, id))))),
              chipBox('extensions', t().ftExtLabel, t().ftExtPlaceholder, editor.draftExt, false),
              chipBox('specials', t().ftSpecialLabel, t().ftSpecialPlaceholder, editor.draftSpecial, true)),
            h('div', { className: 'dsa-modalActions', style: { justifyContent: 'flex-end' } },
              h('button', { className: 'dsa-button', type: 'button', onClick: () => setEditor(null) }, t().dialogCancel),
              h('button', { className: 'dsa-button dsa-primary', type: 'button', onClick: saveEditor }, t().dialogSave))));
      };

      const renderIconDialog = () => {
        if (!iconDialog) return null;
        const group = groups.find((entry) => entry.id === iconDialog);
        return h('div', { className: 'dsa-overlay', role: 'presentation', onClick: () => setIconDialog(null) },
          h('div', { className: 'dsa-modal', role: 'dialog', 'aria-modal': 'true', style: { width: 'min(520px, 92vw)' }, onClick: (event) => event.stopPropagation() },
            h('div', { className: 'dsa-modalHead' },
              iconNode(group ? group.icon : 'document', 30),
              h('div', { style: { minWidth: 0 } },
                h('h3', { className: 'dsa-modalTitle' }, t().ftChangeIcon + (group ? ' · ' + group.label : '')),
                h('div', { className: 'dsa-modalPath' }, iconDialog))),
            h('div', { className: 'dsa-modalBody' },
              h('input', {
                className: 'dsa-input', type: 'search', value: iconQuery, placeholder: t().iconsSearch,
                'aria-label': t().iconsSearch, onChange: (event) => setIconQuery(event.target.value),
              }),
              h('div', { className: 'dsa-iconGrid', role: 'listbox', 'aria-label': t().iconsSearch },
                iconChoices.map((id) => h('button', {
                  key: id, type: 'button', role: 'option', title: id,
                  className: 'dsa-iconCell', 'aria-pressed': group && group.icon === id,
                  onClick: () => { applyIcon(iconDialog, id); setIconDialog(null); },
                }, iconNode(id, 22), h('span', null, id))))),
            h('div', { className: 'dsa-modalActions', style: { justifyContent: 'flex-end' } },
              h('button', { className: 'dsa-button', type: 'button', onClick: () => setIconDialog(null) }, t().dialogCancel))));
      };

      return h('div', null,
        h('h3', { className: 'dsa-setTitle' }, t().tabFileTypes),
        h('p', { className: 'dsa-setHint' }, t().ftHint),
        h('div', { className: 'dsa-setRow dsa-prefRow' },
          h('div', { className: 'dsa-kindText' }, h('span', { className: 'dsa-kindName' }, t().groupByLabel),
            h('div', { className: 'dsa-setHint' }, t().groupByHint)),
          h('div', { className: 'dsa-mapSeg', role: 'group', 'aria-label': t().groupByLabel },
            [['purpose', t().groupByPurpose], ['file', t().groupByFile], ['session', t().groupBySession]].map(([id, label]) => h('button', {
              key: id, type: 'button', className: 'dsa-mapSegBtn', 'aria-pressed': prefs.groupBy === id,
              onClick: () => setPref('groupBy', id),
            }, label)))),
        h('div', { className: 'dsa-mapSeg', role: 'group', 'aria-label': t().tabFileTypes, style: { marginTop: '8px' } },
          [['groups', t().ftGroups], ['kinds', t().ftKinds]].map(([id, label]) => h('button', {
            key: id, type: 'button', className: 'dsa-mapSegBtn', 'aria-pressed': view === id,
            onClick: () => setView(id),
          }, label))),
        view === 'groups' ? renderGroups() : renderKinds(),
        renderEditor(),
        renderIconDialog(),
        renderKindEditor(),
        renderKindIconDialog());
    }

    function SettingsDisplay() {
      const sizes = { sm: 12, md: 13, lg: 14, xl: 15 };
      const columns = normalizeTableColumns(prefs.tableColumns);
      const sourceVisible = !columns.hidden.includes('source');
      const toggleSource = (visible) => {
        const hidden = visible ? columns.hidden.filter((id) => id !== 'source') : [...columns.hidden, 'source'];
        setPref('tableColumns', { ...columns, hidden });
      };
      const previews = [
        ['README.md', 'document'], ['plan.md', 'plan'], ['preview.html', 'preview'], ['changes.diff', 'change'],
      ];
      return h('div', null,
        h('h3', { className: 'dsa-setTitle' }, t().tabDisplay),
        h('p', { className: 'dsa-setHint' }, t().viewHint),
        h('div', { className: 'dsa-setRow dsa-prefRow' },
          h('div', { className: 'dsa-kindText' }, h('span', { className: 'dsa-kindName' }, t().viewModeLabel)),
          h('select', {
            className: 'dsa-input dsa-viewSelect', value: prefs.view, 'aria-label': t().viewModeLabel,
            onChange: (event) => setViewMode(event.target.value),
          }, [['details', t().viewDetails], ['list', t().viewList], ['tiles', t().viewTiles], ['icons', t().viewIcons], ['content', t().viewContent]]
            .filter(([id]) => !prefs.disabledViews.includes(id))
            .map(([id, label]) => h('option', { key: id, value: id }, label)))),
        h('div', { className: 'dsa-setRow dsa-prefRow' },
          h('div', { className: 'dsa-kindText' }, h('span', { className: 'dsa-kindName' }, t().fontSizeLabel)),
          h('select', {
            className: 'dsa-input dsa-viewSelect', value: prefs.font, 'aria-label': t().fontSizeLabel,
            onChange: (event) => setFontSize(event.target.value),
          }, [['sm', t().fontSmall], ['md', t().fontNormal], ['lg', t().fontLarge], ['xl', t().fontXLarge]]
            .map(([id, label]) => h('option', { key: id, value: id }, label)))),
        h(PrefSwitch, {
          label: t().showPath, hint: t().showPathHint,
          checked: prefs.showPath, onChange: setShowPath,
        }),
        h(PrefSwitch, {
          label: t().showSourceColumn, hint: t().showSourceColumnHint,
          checked: sourceVisible, onChange: toggleSource,
        }),
        h('div', { className: 'dsa-setRow dsa-prefRow' },
          h('div', { className: 'dsa-kindText' }, h('span', { className: 'dsa-kindName' }, t().defaultSort)),
          h('select', {
            className: 'dsa-input dsa-viewSelect', value: prefs.sort.key, 'aria-label': t().defaultSort,
            onChange: (event) => {
              const key = event.target.value;
              setPref('sort', { key, dir: key === 'time' ? -1 : 1 });
            },
          }, [['time', t().sortTime], ['name', t().sortName], ['kind', t().sortKind]]
            .map(([id, label]) => h('option', { key: id, value: id }, label)))),
        h('div', { className: 'dsa-setRow dsa-prefRow' },
          h('div', { className: 'dsa-kindText' }, h('span', { className: 'dsa-kindName' }, t().densityLabel)),
          h('select', {
            className: 'dsa-input dsa-viewSelect', value: prefs.density, 'aria-label': t().densityLabel,
            onChange: (event) => setPref('density', event.target.value),
          }, [['comfortable', t().densityComfortable], ['compact', t().densityCompact]]
            .map(([id, label]) => h('option', { key: id, value: id }, label)))),
        h('div', { className: 'dsa-preview' },
          h('div', { className: 'dsa-previewHead' }, h('span', null, t().previewLabel), h('span', { className: 'dsa-count' }, sizes[prefs.font] + 'px')),
          previews.map(([name, kind]) => h('div', {
            key: name, className: 'dsa-previewRow', style: { fontSize: sizes[prefs.font] + 'px' },
          },
            h(FileIcon, { path: name, kind, size: 18 }),
            h('span', { className: 'dsa-name' }, name),
            prefs.showPath ? h('span', { className: 'dsa-path' }, 'C:\demo\workspace\\' + name) : null,
            h('span', { className: 'dsa-count' }, kindLabelOf(kind))))),
        h('div', { className: 'dsa-resetRow' },
          h('button', { className: 'dsa-button', onClick: () => resetPrefs('display') }, t().settingsReset)));
    }

    function SettingsAbout() {
      const [confirming, setConfirming] = useState(false);
      const entries = [['rail', t().locRail], ['guide', t().locGuide], ['turnTail', t().locTail], ['sessionView', t().locSession]]
        .filter(([key]) => prefs.entries[key]).map(([, label]) => label);
      return h('div', null,
        h('h3', { className: 'dsa-setTitle' }, t().tabAbout),
        h('p', { className: 'dsa-setHint' }, t().prefsScope),
        h('dl', { className: 'dsa-about' },
          h('dt', null, t().aboutPlugin), h('dd', null, PACKAGE_NAME),
          h('dt', null, t().aboutVersion), h('dd', null, PLUGIN_VERSION),
          h('dt', null, t().aboutEntrySummary), h('dd', null, entries.length > 0 ? entries.join(' · ') : t().noEntryWarning),
          h('dt', null, t().aboutTypeSummary), h('dd', null, String(kindDefinitions().length) + ' / ' + String(prefs.hiddenKinds.length) + ' ' + t().typesHidden),
          h('dt', null, t().aboutIconSource), h('dd', null, 'material-icon-theme 5.40.0 · MIT'),
          h('dt', null, t().aboutScope), h('dd', null, t().prefsScope)),
        h('div', { className: 'dsa-resetRow' },
          h('button', {
            className: 'dsa-button', type: 'button',
            onClick: () => {
              if (!confirming) { setConfirming(true); return; }
              resetAllPrefs();
              setConfirming(false);
            },
          }, confirming ? t().resetAllConfirm : t().resetAll)));
    }

    // 插件设置页（设置 → 工件）：五个 Tab，偏好统一存 dsh-agent-artifacts.prefs。
    function PluginSummary(props) {
      const [, tick] = useState(0);
      useEffect(() => subscribePrefs(() => tick((value) => value + 1)), []);
      const entries = [['rail', t().locRail], ['guide', t().locGuide], ['turnTail', t().locTail], ['sessionView', t().locSession]]
        .filter(([key]) => prefs.entries[key]).map(([, label]) => label);
      const entrySummary = entries.length > 0 ? entries.join(' · ') : t().noEntryWarning;
      if (props && props.view === 'summary') {
        return h('div', { className: 'dsa-setSummary' }, prefs.scan ? entrySummary + ' · ' + t().scanOnly : entrySummary);
      }
      const viewLabels = { details: 'viewDetails', list: 'viewList', tiles: 'viewTiles', icons: 'viewIcons', content: 'viewContent' };
      const fontLabels = { sm: 'fontSmall', md: 'fontNormal', lg: 'fontLarge', xl: 'fontXLarge' };
      return h('div', { className: 'dsa-set' },
        h(StyleSheet),
        h('h3', { className: 'dsa-setTitle' }, t().title),
        h('p', { className: 'dsa-setHint' }, t().settingsHere),
        h('dl', { className: 'dsa-about' },
          h('dt', null, t().locationLabel), h('dd', null, entrySummary),
          h('dt', null, t().contentLabel), h('dd', null, prefs.scan ? t().scanToggle : '—'),
          h('dt', null, t().viewModeLabel), h('dd', null, t()[viewLabels[prefs.view]]),
          h('dt', null, t().fontSizeLabel), h('dd', null, t()[fontLabels[prefs.font]]),
          h('dt', null, t().tabTypes), h('dd', null, String(kindDefinitions().length - prefs.hiddenKinds.length) + ' / ' + String(kindDefinitions().length)),
          h('dt', null, t().tabFileTypes), h('dd', null, String((prefs.fileTypes || defaultTypeGroups(language)).length) + ' ' + t().ftGroups)));
    }

    function PluginSettings() {
      const [, tick] = useState(0);
      useEffect(() => subscribePrefs(() => tick((value) => value + 1)), []);
      const active = prefs.settingsTab;
      const panels = { entry: SettingsEntry, content: SettingsContent, filetypes: SettingsFileTypes, display: SettingsDisplay, about: SettingsAbout };
      const Panel = panels[active] || SettingsEntry;
      return h('div', { className: 'dsa-set' },
        h(StyleSheet),
        h('div', { className: 'dsa-tabs', role: 'tablist', 'aria-label': t().title },
          SETTINGS_TABS.map((id) => h('button', {
            key: id, type: 'button', role: 'tab', id: 'dsa-tab-' + id,
            className: 'dsa-tab', 'aria-selected': active === id, 'aria-controls': 'dsa-panel-' + id,
            tabIndex: active === id ? 0 : -1,
            onClick: () => setPref('settingsTab', id),
            onKeyDown: (event) => {
              if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
              event.preventDefault();
              const index = SETTINGS_TABS.indexOf(active);
              const next = SETTINGS_TABS[(index + (event.key === 'ArrowRight' ? 1 : SETTINGS_TABS.length - 1)) % SETTINGS_TABS.length];
              setPref('settingsTab', next);
              if (typeof document !== 'undefined') {
                setTimeout(() => {
                  const target = document.getElementById('dsa-tab-' + next);
                  if (target) target.focus();
                }, 0);
              }
            },
          }, t()[TAB_LABELS[id]]))),
        h('div', { className: 'dsa-panel', role: 'tabpanel', id: 'dsa-panel-' + active, 'aria-labelledby': 'dsa-tab-' + active },
          h(Panel)));
    }

    // 右侧栏「工件阅读」tab：自带 Markdown 排版，地址方案 agent-artifacts://read/<session>/<path>。
    function ReaderTab(props) {
      const useTabInfo = props && props.useTabInfo;
      const info = typeof useTabInfo === 'function' ? useTabInfo() : null;
      const tab = info && info.tab;
      const navigation = tab && tab.navigation;
      const address = (tab && tab.contentId) || (navigation && navigation.address) || (navigation && navigation.params && navigation.params.address) || '';
      const path = readerPathOf(address) || (props && props.path) || '';
      const sessionId = (props && props.sessionId) || (tab && tab.sessionId) || '';
      const [doc, setDoc] = useState({ loading: true, error: '', missing: false, text: '', truncated: false });
      const [token, setToken] = useState(0);

      useEffect(() => {
        if (typeof path !== 'string' || path === '') {
          setDoc({ loading: false, error: '', missing: true, text: '', truncated: false });
          return;
        }
        const controller = new AbortController();
        setDoc({ loading: true, error: '', missing: false, text: '', truncated: false });
        const id = encodeArtifactId(sessionId, path);
        if (!id) {
          setDoc({ loading: false, error: t().readerError, missing: false, text: '', truncated: false });
          return;
        }
        fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-dsh-agent-artifacts': '1' },
          body: JSON.stringify({ operation: 'detail', id, sessionId }),
          signal: controller.signal,
        }).then((response) => response.json()).then((body) => {
          if (!body || body.ok !== true) throw new Error((body && body.error && body.error.message) || 'detail failed');
          const preview = body.data.preview || {};
          if (preview.missing === true) {
            setDoc({ loading: false, error: '', missing: true, text: '', truncated: false });
            return;
          }
          if (typeof preview.text === 'string') {
            setDoc({ loading: false, error: '', missing: false, text: preview.text, truncated: preview.truncated === true });
          } else {
            setDoc({ loading: false, error: t().readerError, missing: false, text: '', truncated: false });
          }
        }).catch((error) => {
          if (error && error.name === 'AbortError') return;
          setDoc({ loading: false, error: String(error && error.message || error), missing: false, text: '', truncated: false });
        });
        return () => controller.abort();
      }, [path, sessionId, token]);

      const reload = () => setToken((value) => value + 1);
      return h('div', { className: 'dsa-reader' },
        h(StyleSheet),
        h('div', { className: 'dsa-readerInner' },
          path ? h('div', { className: 'dsa-readerPath' }, path) : null,
          doc.loading ? h('div', { className: 'dsa-readerNote' }, t().readerLoading) : null,
          !doc.loading && doc.missing ? h('div', { className: 'dsa-readerNote' }, t().readerMissing) : null,
          !doc.loading && !doc.missing && doc.error !== '' ? h('div', { className: 'dsa-readerNote' },
            h('div', null, t().readerError),
            h('div', { className: 'dsa-readerError' }, doc.error),
            h('button', { className: 'dsa-button', onClick: reload }, t().retry)) : null,
          !doc.loading && !doc.missing && doc.error === '' ? h('div', {
            className: 'dsa-markdown',
            dangerouslySetInnerHTML: { __html: markdownToHtml(doc.text) },
          }) : null,
          doc.truncated ? h('div', { className: 'dsa-readerNote' }, t().readerTruncated) : null));
    }

    // 右侧栏「开始」页的排序：原生按各插件 guide[].order 升序，平手按注册顺序，
    // 没有界面可调。这里在注册表上包一层排序：先用下列规则给已知入口定位，
    // 未识别的保持原生相对顺序；再用 localStorage（dsh-agent-artifacts-guide-order，
    // 形如 ["files","agent-artifacts","terminal"]）可按 kind 名完全自定义。
    const GUIDE_ORDER_KEY = 'dsh-agent-artifacts-guide-order';
    const GUIDE_RULES = [
      ['agent-artifacts', 0], ['files', 10], ['terminal', 20], ['browser', 30],
      ['git', 40], ['diff', 50], ['chat-import', 60], ['subagent', 70],
      ['sidechat', 80], ['mnemon', 85], ['memory', 85], ['inspector', 100],
    ];

    function guideRank(entry, custom) {
      const hay = (String(entry && entry.kind || '') + ' ' + String(entry && entry.providerId || '')).toLowerCase();
      if (custom.length > 0) {
        const index = custom.findIndex((needle) => hay.includes(String(needle).toLowerCase()));
        if (index >= 0) return index;
        for (const [needle, rank] of GUIDE_RULES) if (hay.includes(needle)) return 1000 + rank;
        return 1500;
      }
      for (const [needle, rank] of GUIDE_RULES) if (hay.includes(needle)) return rank;
      return 500;
    }

    function readGuideOrder() {
      try {
        const raw = globalThis.localStorage && localStorage.getItem(GUIDE_ORDER_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter((value) => typeof value === 'string') : [];
      } catch {
        return [];
      }
    }

    function installGuideOrder(tabs) {
      if (!tabs || typeof tabs.guide !== 'function' || tabs.guide.__dsaSorted === true) return;
      const original = tabs.guide.bind(tabs);
      // useSyncExternalStore 要求同一快照返回同一引用；排序结果必须按（原数组 + 自定义列表）缓存。
      let source = null;
      let customKey = null;
      let cached = null;
      const sorted = () => {
        try {
          try {
            if (globalThis.localStorage && localStorage.getItem('dsh-agent-artifacts-guide-sort') === 'off') return original();
          } catch {
            // 无 localStorage 时照常排序
          }
          const raw = original();
          const custom = readGuideOrder();
          const key = custom.join('\u0000');
          if (raw === source && key === customKey) return cached;
          source = raw;
          customKey = key;
          cached = raw
            .map((entry, index) => ({ entry, index }))
            .sort((left, right) => guideRank(left.entry, custom) - guideRank(right.entry, custom) || left.index - right.index)
            .map((row) => row.entry);
          return cached;
        } catch {
          return original();
        }
      };
      sorted.__dsaSorted = true;
      tabs.guide = sorted;
    }

    // #region kind-model
    const BUILTIN_KIND_IDS = ['plan', 'walkthrough', 'change', 'diagram', 'evidence', 'preview', 'document', 'code', 'other'];
    const GROUP_BYS = ['purpose', 'file', 'session'];
    const MAX_ARTIFACT_KINDS = 20;
    const KIND_TONE_PALETTE = ['#5b8def', '#3aa88f', '#d4803f', '#8a7be0', '#3f9e63', '#c99a3d', '#4a8fbd', '#7d6bd6', '#c06b8d', '#7a7a7a'];

    function normalizeArtifactKinds(value) {
      if (!Array.isArray(value)) return [];
      const seen = new Set();
      const result = [];
      for (const entry of value) {
        if (!entry || typeof entry !== 'object') continue;
        const id = typeof entry.id === 'string' ? entry.id.trim().toLowerCase() : '';
        if (!/^custom-[a-z0-9][a-z0-9-]{0,23}$/.test(id) || seen.has(id) || BUILTIN_KIND_IDS.includes(id)) continue;
        const label = typeof entry.label === 'string' ? entry.label.trim().slice(0, 20) : '';
        if (label === '') continue;
        const icon = typeof entry.icon === 'string' && entry.icon !== '' ? entry.icon : 'document';
        const tone = KIND_TONE_PALETTE.includes(entry.tone) ? entry.tone : KIND_TONE_PALETTE[result.length % KIND_TONE_PALETTE.length];
        seen.add(id);
        result.push({ id, label, icon, tone, custom: true });
        if (result.length >= MAX_ARTIFACT_KINDS) break;
      }
      return result;
    }

    function normalizeKindIcons(value, validIds) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
      const result = {};
      for (const [id, icon] of Object.entries(value)) {
        if (typeof id !== 'string' || typeof icon !== 'string' || icon === '') continue;
        if (!validIds.has(id)) continue;
        result[id] = icon;
      }
      return result;
    }

    function mergeKindDefinitions(builtin, custom) {
      const seen = new Set(builtin.map((kind) => kind.id));
      return [...builtin, ...custom.filter((kind) => !seen.has(kind.id))];
    }

    /** 稳定分组：按 order 排序，未在 order 中的 key 追加在末尾。 */
    function bucketItems(items, keyOf, order) {
      const buckets = new Map();
      for (const item of items) {
        const key = keyOf(item);
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key).push(item);
      }
      const ranked = [...buckets.keys()].sort((left, right) => {
        const a = order.indexOf(left);
        const b = order.indexOf(right);
        if (a < 0 && b < 0) return String(left).localeCompare(String(right));
        if (a < 0) return 1;
        if (b < 0) return -1;
        return a - b;
      });
      return ranked.map((key) => ({ key, items: buckets.get(key) }));
    }
    // #endregion kind-model

    // #region prefs
    // 统一偏好：单 key + 版本号；旧 key 在首次启动时迁移并备份。
    const PREF_KEY = 'dsh-agent-artifacts.prefs';
    const PREF_BACKUP_KEY = 'dsh-agent-artifacts.prefs.legacy-backup';
    const VIEW_MODES = ['details', 'list', 'tiles', 'icons', 'content'];
    const DISABLEABLE_VIEWS = ['tiles', 'content'];
    const FONT_MODES = ['sm', 'md', 'lg', 'xl'];
    const DENSITIES = ['comfortable', 'compact'];
    const SORT_KEYS = ['time', 'name', 'kind'];
    const SETTINGS_TABS = ['entry', 'content', 'filetypes', 'display', 'about'];
    const MAX_ICON_OVERRIDES = 200;
    const LEGACY_KEYS = {
      locations: 'dsh-agent-artifacts-locations',
      scan: 'dsh-agent-artifacts-scan',
      showPath: 'dsh-agent-artifacts-show-path',
      view: 'dsh-agent-artifacts-view-mode',
      font: 'dsh-agent-artifacts-font-size',
      hiddenKinds: 'dsh-agent-artifacts-hidden-kinds',
      types: 'dsh-agent-artifacts-types',
    };

    function defaultPrefs() {
      return {
        v: 1,
        entries: { rail: false, guide: true, turnTail: false, sessionView: false },
        scan: false,
        hideCodeDefault: true,
        hiddenKinds: [],
        artifactTags: {},
        artifactPolicy: 'writes',
        tagBackfillAt: 0,
        autoTags: {},
        autoTagsRev: 0,
        iconOverrides: [],
        groupBy: 'purpose',
        collapsedGroups: [],
        artifactKinds: [],
        kindIcons: {},
        fileTypes: null,
        tableColumns: null,
        pathScope: 'workspace',
        disabledViews: ['tiles', 'content'],
        view: 'details',
        font: 'md',
        showPath: false,
        sort: { key: 'time', dir: -1 },
        density: 'comfortable',
        settingsTab: 'entry',
      };
    }

    function normalizeDisabledViews(value) {
      if (!Array.isArray(value)) return [...defaultPrefs().disabledViews];
      return [...new Set(value.filter((id) => DISABLEABLE_VIEWS.includes(id)))];
    }

    function normalizePrefs(raw) {
      const base = defaultPrefs();
      const rawKinds = raw && typeof raw === 'object' ? normalizeArtifactKinds(raw.artifactKinds) : [];
      base.artifactKinds = rawKinds;
      const purposeIds = new Set([...BUILTIN_KIND_IDS, 'untagged', ...rawKinds.map((kind) => kind.id)]);
      const legacy = { design: 'document', task: 'document', diff: 'change', screenshot: 'evidence', recording: 'evidence', interactive: 'preview', prototype: 'preview' };
      const normalize = (id) => legacy[id] || id;
      if (!raw || typeof raw !== 'object') return base;
      const entries = raw.entries && typeof raw.entries === 'object' ? raw.entries : {};
      for (const key of ['rail', 'guide', 'turnTail', 'sessionView']) {
        if (typeof entries[key] === 'boolean') base.entries[key] = entries[key];
      }
      if (typeof raw.scan === 'boolean') base.scan = raw.scan;
      if (typeof raw.hideCodeDefault === 'boolean') base.hideCodeDefault = raw.hideCodeDefault;
      if (Array.isArray(raw.hiddenKinds)) {
        base.hiddenKinds = [...new Set(raw.hiddenKinds
          .filter((id) => typeof id === 'string' && id !== '')
          .map((id) => normalize(id))
          .filter((id) => purposeIds.has(id)))];
      }
      if (raw.artifactTags && typeof raw.artifactTags === 'object' && !Array.isArray(raw.artifactTags)) {
        for (const [path, tag] of Object.entries(raw.artifactTags)) {
          if (typeof path !== 'string' || path === '') continue;
          const normalized = normalize(tag);
          if (purposeIds.has(normalized)) base.artifactTags[path] = normalized;
        }
      }
      if (raw.artifactPolicy === 'explicit' || raw.artifactPolicy === 'writes') base.artifactPolicy = raw.artifactPolicy;
      if (Number.isFinite(raw.tagBackfillAt) && raw.tagBackfillAt > 0) base.tagBackfillAt = raw.tagBackfillAt;
      if (Number.isInteger(raw.autoTagsRev) && raw.autoTagsRev > 0) base.autoTagsRev = raw.autoTagsRev;
      if (raw.autoTags && typeof raw.autoTags === 'object' && !Array.isArray(raw.autoTags)) {
        for (const [path, tag] of Object.entries(raw.autoTags)) {
          if (typeof path !== 'string' || path === '') continue;
          const normalized = normalize(tag);
          if (purposeIds.has(normalized)) base.autoTags[path] = normalized;
        }
      }
      if (Array.isArray(raw.iconOverrides)) {
        const seen = new Set();
        base.iconOverrides = [];
        for (const entry of raw.iconOverrides) {
          if (!entry || !['path', 'name', 'ext'].includes(entry.level)) continue;
          if (typeof entry.match !== 'string' || entry.match.trim() === '') continue;
          if (typeof entry.icon !== 'string' || entry.icon === '') continue;
          let match = entry.match.trim();
          if (entry.level === 'ext') {
            match = '.' + match.replace(/^\./, '').toLowerCase();
          } else if (entry.level === 'name') {
            match = match.toLowerCase();
          }
          const key = entry.level + '\u0000' + match.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          base.iconOverrides.push({ level: entry.level, match, icon: entry.icon });
          if (base.iconOverrides.length >= MAX_ICON_OVERRIDES) break;
        }
      }
      if (Array.isArray(raw.fileTypes)) base.fileTypes = normalizeTypeGroups(raw.fileTypes, language);
      if (raw.tableColumns && typeof raw.tableColumns === 'object') base.tableColumns = normalizeTableColumns(raw.tableColumns);
      if (raw.pathScope === 'all' || raw.pathScope === 'workspace') base.pathScope = raw.pathScope;
      if (Array.isArray(raw.disabledViews)) {
        base.disabledViews = [...new Set(raw.disabledViews.filter((id) => DISABLEABLE_VIEWS.includes(id)))];
      }
      if (VIEW_MODES.includes(raw.view)) base.view = raw.view;
      if (base.disabledViews.includes(base.view)) base.view = 'details';
      if (FONT_MODES.includes(raw.font)) base.font = raw.font;
      if (typeof raw.showPath === 'boolean') base.showPath = raw.showPath;
      if (raw.sort && typeof raw.sort === 'object') {
        if (SORT_KEYS.includes(raw.sort.key)) base.sort.key = raw.sort.key;
        base.sort.dir = raw.sort.dir === 1 ? 1 : -1;
      }
      if (DENSITIES.includes(raw.density)) base.density = raw.density;
      if (SETTINGS_TABS.includes(raw.settingsTab)) base.settingsTab = raw.settingsTab;
      if (GROUP_BYS.includes(raw.groupBy)) base.groupBy = raw.groupBy;
      if (Array.isArray(raw.collapsedGroups)) {
        base.collapsedGroups = [...new Set(raw.collapsedGroups.filter((key) => typeof key === 'string' && key !== ''))].slice(0, 200);
      }
      base.kindIcons = normalizeKindIcons(raw.kindIcons, purposeIds);
      return base;
    }

    // 只返回“从旧 key 迁移出的部分偏好”，不碰存储；便于单测。
    function readLegacyPrefs(storage) {
      const partial = {};
      const snapshot = {};
      const get = (key) => { try { return storage && typeof storage.getItem === 'function' ? storage.getItem(key) : null; } catch { return null; } };
      const locationsRaw = get(LEGACY_KEYS.locations);
      if (locationsRaw) {
        snapshot.locations = locationsRaw;
        try {
          const parsed = JSON.parse(locationsRaw);
          if (parsed && typeof parsed.rail === 'boolean') {
            partial.entries = {};
            for (const key of ['rail', 'guide', 'turnTail', 'sessionView']) partial.entries[key] = parsed[key] === true;
          }
        } catch { /* 忽略损坏的旧值 */ }
      }
      if (get(LEGACY_KEYS.scan) === 'on') { partial.scan = true; snapshot.scan = 'on'; }
      if (get(LEGACY_KEYS.showPath) === 'on') { partial.showPath = true; snapshot.showPath = 'on'; }
      const viewRaw = get(LEGACY_KEYS.view);
      if (VIEW_MODES.includes(viewRaw)) { partial.view = viewRaw; snapshot.view = viewRaw; }
      const fontRaw = get(LEGACY_KEYS.font);
      if (FONT_MODES.includes(fontRaw)) { partial.font = fontRaw; snapshot.font = fontRaw; }
      const hiddenRaw = get(LEGACY_KEYS.hiddenKinds);
      if (hiddenRaw) {
        snapshot.hiddenKinds = hiddenRaw;
        try {
          const parsed = JSON.parse(hiddenRaw);
          if (Array.isArray(parsed)) partial.hiddenKinds = parsed.filter((id) => typeof id === 'string');
        } catch { /* 忽略 */ }
      } else {
        const typesRaw = get(LEGACY_KEYS.types);
        if (typesRaw) {
          snapshot.types = typesRaw;
          try {
            const parsed = JSON.parse(typesRaw);
            if (Array.isArray(parsed)) {
              partial.hiddenKinds = parsed.filter((entry) => entry && entry.enabled === false).map((entry) => entry.id).filter((id) => typeof id === 'string');
            }
          } catch { /* 忽略 */ }
        }
      }
      const saw = Object.keys(snapshot).length > 0;
      return { prefs: partial, snapshot, saw };
    }
    // #endregion prefs

    function readStoredPrefs() {
      try {
        const raw = globalThis.localStorage && localStorage.getItem(PREF_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const next = normalizePrefs(parsed);
          const oldOverrides = Array.isArray(parsed.iconOverrides) ? parsed.iconOverrides : [];
          if (migrateIconOverrides(next)) {
            try {
              localStorage.setItem('dsh-agent-artifacts.prefs.icon-overrides-backup', JSON.stringify(oldOverrides));
            } catch { /* 备份失败不阻塞 */ }
            writePrefs(next);
          }
          return next;
        }
        const legacy = readLegacyPrefs(globalThis.localStorage);
        if (legacy.saw) {
          const merged = normalizePrefs(legacy.prefs);
          try { localStorage.setItem(PREF_BACKUP_KEY, JSON.stringify(legacy.snapshot)); } catch { /* 备份失败不阻塞 */ }
          writePrefs(merged);
          return merged;
        }
      } catch {
        // 存储损坏时回默认
      }
      return defaultPrefs();
    }
    const prefs = readStoredPrefs();
    const prefListeners = new Set();
    function writePrefs(value) {
      try {
        if (globalThis.localStorage) localStorage.setItem(PREF_KEY, JSON.stringify(value));
      } catch {
        // 存不了就只在本页生效
      }
    }
    function notifyPrefs() {
      for (const listener of prefListeners) listener();
    }
    function subscribePrefs(listener) {
      prefListeners.add(listener);
      return () => prefListeners.delete(listener);
    }
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      try {
        window.addEventListener('storage', (event) => {
          if (event.key !== PREF_KEY) return;
          try {
            const next = normalizePrefs(JSON.parse(event.newValue));
            // entries 必须原位更新，locationState 持有的是同一个对象引用。
            for (const key of Object.keys(prefs.entries)) prefs.entries[key] = next.entries[key];
            prefs.scan = next.scan;
            prefs.hideCodeDefault = next.hideCodeDefault;
            prefs.hiddenKinds = next.hiddenKinds;
            prefs.groupBy = next.groupBy;
            prefs.collapsedGroups = next.collapsedGroups;
            prefs.artifactKinds = next.artifactKinds;
            prefs.kindIcons = next.kindIcons;
            prefs.view = next.view;
            prefs.font = next.font;
            prefs.showPath = next.showPath;
            prefs.sort = next.sort;
            prefs.density = next.density;
            prefs.settingsTab = next.settingsTab;
            notifyPrefs();
          } catch { /* 忽略外部损坏值 */ }
        });
      } catch { /* 忽略 */ }
    }
    function setPref(path, value) {
      const parts = String(path).split('.');
      let target = prefs;
      for (let index = 0; index < parts.length - 1; index += 1) {
        const step = parts[index];
        if (!target[step] || typeof target[step] !== 'object') return;
        target = target[step];
      }
      target[parts[parts.length - 1]] = value;
      writePrefs(prefs);
      notifyPrefs();
    }
    function resetPrefs(tab) {
      const base = defaultPrefs();
      if (tab === 'entry') {
        for (const key of Object.keys(base.entries)) prefs.entries[key] = base.entries[key];
      } else if (tab === 'content') {
        prefs.scan = base.scan;
        prefs.hideCodeDefault = base.hideCodeDefault;
        prefs.disabledViews = [...base.disabledViews];
      } else if (tab === 'types') {
        prefs.hiddenKinds = [];
        prefs.artifactKinds = [];
        prefs.kindIcons = {};
        prefs.groupBy = base.groupBy;
      } else if (tab === 'icons') {
        prefs.iconOverrides = [];
      } else if (tab === 'filetypes') {
        prefs.fileTypes = null;
      } else if (tab === 'display') {
        prefs.view = base.view;
        prefs.disabledViews = [...base.disabledViews];
        prefs.font = base.font;
        prefs.showPath = base.showPath;
        prefs.sort = { ...base.sort };
        prefs.density = base.density;
      }
      writePrefs(prefs);
      notifyPrefs();
    }
    function resetAllPrefs() {
      const base = defaultPrefs();
      for (const key of Object.keys(base.entries)) prefs.entries[key] = base.entries[key];
      prefs.scan = base.scan;
      prefs.hideCodeDefault = base.hideCodeDefault;
      prefs.hiddenKinds = [];
      prefs.iconOverrides = [];
      prefs.groupBy = base.groupBy;
      prefs.collapsedGroups = [];
      prefs.artifactKinds = [];
      prefs.kindIcons = {};
      prefs.fileTypes = null;
      prefs.tableColumns = null;
      prefs.pathScope = 'workspace';
      prefs.view = base.view;
      prefs.font = base.font;
      prefs.showPath = base.showPath;
      prefs.sort = { ...base.sort };
      prefs.density = base.density;
      prefs.settingsTab = base.settingsTab;
      writePrefs(prefs);
      notifyPrefs();
    }

    // 固定 kind 注册表：对齐 Antigravity 的交付物类型 + DSH 文件层兜底。
    // id 必须与 lib/classify.js 的 ARTIFACT_KIND_IDS 一致（test/kinds.test.mjs 锁定）。
    const KINDS = [
      { id: 'plan', group: 'deliverable', labelKey: 'plan', descriptionKey: 'kindDescPlan' },
      { id: 'walkthrough', group: 'deliverable', labelKey: 'walkthrough', descriptionKey: 'kindDescWalkthrough' },
      { id: 'change', group: 'deliverable', labelKey: 'changeLabel', descriptionKey: 'kindDescChange' },
      { id: 'diagram', group: 'deliverable', labelKey: 'diagramLabel', descriptionKey: 'kindDescDiagram' },
      { id: 'evidence', group: 'visual', labelKey: 'evidenceLabel', descriptionKey: 'kindDescEvidence' },
      { id: 'preview', group: 'page', labelKey: 'previewLabel', descriptionKey: 'kindDescPreview' },
      { id: 'document', group: 'file', labelKey: 'document', descriptionKey: 'kindDescDocument' },
      { id: 'code', group: 'file', labelKey: 'code', descriptionKey: 'kindDescCode' },
      { id: 'other', group: 'file', labelKey: 'other', descriptionKey: 'kindDescOther' },
      { id: 'untagged', group: 'file', labelKey: 'untaggedLabel', descriptionKey: 'kindDescUntagged' },
    ];
    const KIND_GROUPS = [
      ['deliverable', 'kindGroupDeliverable'],
      ['visual', 'kindGroupVisual'],
      ['page', 'kindGroupPage'],
      ['file', 'kindGroupFile'],
    ];
    function kindDefinitions() {
      const merged = mergeKindDefinitions(KINDS, prefs.artifactKinds || []);
      const untagged = merged.find((kind) => kind.id === 'untagged');
      return [...merged.filter((kind) => kind.id !== 'untagged'), untagged].filter(Boolean);
    }
    function kindDefinitionOf(id) {
      return kindDefinitions().find((kind) => kind.id === id) || null;
    }
    function artifactKindLabel(id) {
      const meta = kindDefinitionOf(id);
      if (!meta) return id || 'untagged';
      return meta.custom ? meta.label : (t()[meta.labelKey] || id);
    }
    // 兼容层：面板与设置页通过具名函数读写统一偏好。
    const locationState = prefs.entries;
    function setLocation(key, value) {
      if (!['rail', 'guide', 'turnTail', 'sessionView'].includes(key)) return;
      setPref('entries.' + key, value === true);
    }
    const subscribeLocations = subscribePrefs;

    const scanState = { get on() { return prefs.scan === true; } };
    function setScan(value) { setPref('scan', value === true); }
    const subscribeScan = subscribePrefs;

    const showPathState = { get on() { return prefs.showPath === true; } };
    function setShowPath(value) { setPref('showPath', value === true); }
    const subscribeShowPath = subscribePrefs;

    const viewModeState = { get value() { return prefs.view; } };
    function setViewMode(value) { if (VIEW_MODES.includes(value) && !prefs.disabledViews.includes(value)) setPref('view', value); }
    const subscribeViewMode = subscribePrefs;

    const fontSizeState = { get value() { return prefs.font; } };
    function setFontSize(value) { if (FONT_MODES.includes(value)) setPref('font', value); }
    const subscribeFontSize = subscribePrefs;

    const hiddenKinds = { get set() { return new Set(prefs.hiddenKinds); } };
    const subscribeKinds = subscribePrefs;
    function setKindVisible(id, visible) {
      if (!kindDefinitions().some((kind) => kind.id === id)) return;
      const next = new Set(prefs.hiddenKinds);
      if (visible === false) next.add(id);
      else next.delete(id);
      setPref('hiddenKinds', [...next]);
    }
    function kindLabelOf(id) {
      return artifactKindLabel(id);
    }
    const INFER_REV = 3;
    const VERSION_TONES = ['#9fc3ff', '#7fd6c2', '#ffc45e', '#c4a7ff', '#ff9bb0', '#a8d08d', '#f0a6dc'];
    function versionTone(version) {
      const n = Number(version) || 1;
      return VERSION_TONES[(n - 1) % VERSION_TONES.length];
    }
    function inferPurpose(path) {
      const text = String(path || '');
      const ext = (text.split('.').pop() || '').toLowerCase();
      const base = (text.split(/[\\/]/).pop() || '').toLowerCase();
      if (['diff', 'patch'].includes(ext)) return 'change';
      if (['mmd', 'mermaid', 'puml', 'pu', 'plantuml', 'drawio', 'dio', 'excalidraw'].includes(ext)) return 'diagram';
      if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'avif', 'ico', 'svg'].includes(ext)) return 'evidence';
      if (['mp4', 'webm', 'mov', 'm4v', 'mkv', 'avi'].includes(ext)) return 'evidence';
      if (/(^|[-_\\/ .])(plans?|roadmaps?)([-_\\/ .]|$)|规划/i.test(text)) return 'plan';
      if (/(^|[-_ .])(implementation[-_ ]?plan|plan|roadmap)([-_ .]|$)|规划/i.test(base)) return 'plan';
      if (/(^|[-_ .])(walkthrough|walk-through)([-_ .]|$)|走查/i.test(base)) return 'walkthrough';
      if (/(^|[-_ .])(architecture|diagram|flowchart|erd)([-_ .]|$)|架构图|流程图/i.test(base)) return 'diagram';
      if (['html', 'htm'].includes(ext)) return 'preview';
      if (['md', 'mdx', 'txt', 'pdf', 'doc', 'docx', 'rtf', 'epub', 'org', 'rst', 'csv', 'tsv', 'xlsx', 'xls', 'ods', 'pptx', 'ppt', 'key', 'odp', 'zip', 'tar', 'gz', 'tgz', '7z', 'rar', 'zst'].includes(ext)) return 'document';
      if (['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'py', 'ps1', 'sh', 'bat', 'sql', 'css', 'scss', 'go', 'rs', 'java', 'c', 'cc', 'cpp', 'h', 'hpp', 'rb', 'php', 'lua', 'json', 'jsonc', 'yaml', 'yml', 'toml', 'ini', 'xml', 'env', 'lock'].includes(ext)) return 'code';
      return 'other';
    }
    function taggedCategory(path, fallback) {
      const manual = prefs.artifactTags && prefs.artifactTags[path];
      if (manual) return manual;
      const auto = prefs.autoTags && prefs.autoTags[path];
      return auto || fallback || 'untagged';
    }
    function setArtifactTag(path, tag) {
      const next = { ...(prefs.artifactTags || {}) };
      if (tag && tag !== 'untagged') next[path] = tag;
      else delete next[path];
      setPref('artifactTags', next);
    }
    function visibleArtifacts(items) {
      return items
        .map((item) => ({ ...item, category: taggedCategory(item.path, item.category) }))
        .filter((item) => !prefs.hiddenKinds.includes(item.category || 'other'));
    }

    function apply(ctx) {
      const slots = ctx.slots;
      if (!slots) return;
      let openRightTab = () => {};
      let openFileTab = () => false;
      const mount = (name, options, component) => ctx.effect(() => slots.inject(name, () => slots.register({ name, ...options }, component)));
      const localeService = ctx.get ? ctx.get('locale') : undefined;
      try {
        if (localeService && typeof localeService.getLocale === 'function') {
          const snapshot = localeService.getLocale();
          const id = snapshot && (snapshot.id || snapshot.locale);
          if (typeof id === 'string' && id !== '') language = /^zh/i.test(id) ? 'zh' : 'en';
        }
      } catch {
        // keep navigator fallback
      }
      const locations = locationState;
      let syncTab = () => {};
      let lastEntrySignature = '';
      const onEntryChange = () => {
        const signature = [locations.rail, locations.guide, locations.turnTail, locations.sessionView]
          .map((value) => (value === true ? 1 : 0)).join('');
        if (signature === lastEntrySignature) return;
        lastEntrySignature = signature;
        syncRail();
        syncOptional();
        syncTab();
      };

      // 设置 → 左侧导航 → 工件（独立设置分区）
      mount('settings.section', { id: PANEL_ID, order: 60, label: () => t().title }, PluginSettings);
      mount('plugins.bundle.config', { key: PACKAGE_NAME }, PluginSummary);
      // 组件行自己的配置页（设置 → 插件 → 工件 → 包含的组件 → 该行）也显示同一组开关。
      mount('plugins.row.config', { key: PACKAGE_NAME + '#' + PANEL_ID }, PluginSummary);

      let railDisposers = [];
      const syncRail = () => {
        for (const dispose of railDisposers.splice(0)) {
          try { dispose(); } catch { /* 已释放 */ }
        }
        if (!locations.rail) return;
        railDisposers.push(mount('sidebar.panellist', { id: PANEL_ID, order: 50, label: () => t().title }, Icon));
        railDisposers.push(mount('main', {
          key: PANEL_ID,
          inject: () => ({
            openRight: (target) => openRightTab(target),
            openFile: (sessionId, cwd, path) => openFileTab(sessionId, cwd, path),
          }),
        }, WorkspacePage));
      };
      syncRail();

      let sessionDisposer = null;
      let tailDisposer = null;
      const syncOptional = () => {
        if (sessionDisposer !== null) { sessionDisposer(); sessionDisposer = null; }
        if (locations.sessionView) {
          sessionDisposer = mount('conversation.view', {
            id: PANEL_ID, order: 40, label: () => t().sessionView,
            inject: (sessionId) => ({
              openRight: (target) => openRightTab(target || sessionId),
              openFile: (target, cwd, path) => openFileTab(target || sessionId, cwd, path),
            }),
          }, SessionView);
        }
        if (tailDisposer !== null) { tailDisposer(); tailDisposer = null; }
        if (locations.turnTail) {
          tailDisposer = mount('conversation.chat.turnTail', {
            id: 'agent-artifacts/turn-tail', order: 15,
            inject: (sessionId) => ({ openFile: (target, cwd, path) => openFileTab(target || sessionId, cwd, path) }),
          }, TurnArtifacts);
        }
      };
      syncOptional();
      lastEntrySignature = [locations.rail, locations.guide, locations.turnTail, locations.sessionView].map((value) => (value === true ? 1 : 0)).join('');
      const offEntryChange = subscribePrefs(onEntryChange);
      ctx.effect(() => () => offEntryChange());

      // 右侧栏原生 tab：等宿主发布 sidebarRightTabs + sidebarRight（better-sidebar 也走这两个服务）。
      ctx.inject(['layout', 'sidebarRightTabs', 'sidebarRight'], (scope) => {
        const tabs = scope.get('sidebarRightTabs');
        const right = scope.get('sidebarRight');
        const layout = scope.get('layout');
        if (!tabs || typeof tabs.register !== 'function') return;
        if (right && typeof right.openTab === 'function') {
          openRightTab = (sessionId) => {
            if (!sessionId) return;
            try {
              right.openTab({ sessionId, kind: PANEL_ID, params: {}, revealIfOpened: true });
            } catch (error) {
              console.warn('[agent-artifacts] open right tab failed', error);
            }
          };
        }
        if (right && typeof right.openResource === 'function') {
          openFileTab = (sessionId, cwd, path) => {
            if (typeof sessionId !== 'string' || sessionId === '' || typeof path !== 'string' || path === '') return false;
            try {
              if (/\.(?:md|markdown|mdx)$/i.test(String(path))) {
                try {
                  right.openResource(readerAddressFor(sessionId, path));
                } catch (error) {
                  // 阅读 tab 不可用时退回原生预览，至少仍是一个 tab。
                  right.openResource(fileAddressFor(sessionId, cwd, path));
                }
              } else {
                right.openResource(fileAddressFor(sessionId, cwd, path));
              }
              return true;
            } catch (error) {
              console.warn('[agent-artifacts] open file tab failed', error);
              return false;
            }
          };
        }
        installGuideOrder(tabs);
        scope.effect(() => {
          try {
            return tabs.register({
              id: PACKAGE_NAME + '/reader',
              kind: READER_KIND,
              multiple: true,
              keepMounted: false,
              priority: 'extension',
              patterns: ['dsh-resource://artifact/**'],
              canOpen: (address) => typeof address === 'string' && address.startsWith(READER_PREFIX),
              title: (address) => readerFileName(readerPathOf(address)) || t().readerTitle,
            });
          } catch (error) {
            console.warn('[agent-artifacts] reader tab registration failed', error);
            return () => {};
          }
        });
        scope.effect(() => scope.slots.inject('sidebar.right.pane.tab', () => scope.slots.register({
          // 槽位按 tab 类型的 id 派发（不是 kind），阅读类型 id 带包名前缀。
          name: 'sidebar.right.pane.tab', key: PACKAGE_NAME + '/reader', inject: () => ({}),
        }, ReaderTab)));
        const syncTabImpl = () => {
          if (tabDisposer !== null) { tabDisposer(); tabDisposer = null; }
          tabDisposer = scope.effect(() => {
            try {
              return tabs.register({
                id: PANEL_ID,
                kind: PANEL_ID,
                multiple: false,
                keepMounted: false,
                priority: 'extension',
                title: () => t().title,
                guide: locations.guide ? [guideEntry] : [],
              });
            } catch (error) {
              console.warn('[agent-artifacts] right sidebar registration failed', error);
              return () => {};
            }
          });
        };
        syncTab = syncTabImpl;
        let tabDisposer = null;
        const guideEntry = {
          id: PANEL_ID,
          order: 30,
          title: () => t().title,
          description: () => t().rightHint,
          icon: (props) => h(Icon, { size: (props && props.size) || 16 }),
        };
        syncTabImpl();
        scope.effect(() => scope.slots.inject('sidebar.right.pane.tab', () => scope.slots.register({
          name: 'sidebar.right.pane.tab', key: PANEL_ID,
          inject: (sessionId) => ({ openFile: (target, cwd, path) => openFileTab(target || sessionId, cwd, path) }),
        }, RightArtifacts)));
      });
    }

    return { inject: ['slots'], apply };
  },
});
