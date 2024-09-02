({
  onRender: function (component) {
    var sectionName = component.get("v.pageReference").state.c__sectionName;
    var iconName = component.get("v.pageReference").state.c__iconName;
    var label = sectionName ? sectionName : "Business Unit Related List";
    var icon = iconName ? iconName : "standard:related_list";
    var workspaceAPI = component.find("workspace");
    workspaceAPI.getEnclosingTabId().then(function (tabId) {
      workspaceAPI.setTabLabel({
        tabId: tabId,
        label: label
      });
      workspaceAPI.setTabIcon({
        tabId: tabId,
        icon: icon
      });
    });
  }
});
