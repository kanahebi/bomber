(function() {
  var OverlayManager;

  module.exports = OverlayManager = (function() {
    function OverlayManager(presenter, container) {
      this.presenter = presenter;
      this.container = container;
      this.overlayNodesById = {};
    }

    OverlayManager.prototype.render = function(state) {
      var decorationId, id, item, overlayNode, pixelPosition, _ref, _ref1, _ref2;
      _ref = state.content.overlays;
      for (decorationId in _ref) {
        _ref1 = _ref[decorationId], pixelPosition = _ref1.pixelPosition, item = _ref1.item;
        this.renderOverlay(state, decorationId, item, pixelPosition);
      }
      _ref2 = this.overlayNodesById;
      for (id in _ref2) {
        overlayNode = _ref2[id];
        if (!state.content.overlays.hasOwnProperty(id)) {
          delete this.overlayNodesById[id];
          overlayNode.remove();
        }
      }
    };

    OverlayManager.prototype.renderOverlay = function(state, decorationId, item, pixelPosition) {
      var itemHeight, itemWidth, left, overlayNode, scrollLeft, scrollTop, top, _ref;
      item = atom.views.getView(item);
      if (!(overlayNode = this.overlayNodesById[decorationId])) {
        overlayNode = this.overlayNodesById[decorationId] = document.createElement('atom-overlay');
        overlayNode.appendChild(item);
        this.container.appendChild(overlayNode);
      }
      itemWidth = item.offsetWidth;
      itemHeight = item.offsetHeight;
      _ref = state.content, scrollTop = _ref.scrollTop, scrollLeft = _ref.scrollLeft;
      left = pixelPosition.left;
      if (left + itemWidth - scrollLeft > this.presenter.contentFrameWidth && left - itemWidth >= scrollLeft) {
        left -= itemWidth;
      }
      top = pixelPosition.top + this.presenter.lineHeight;
      if (top + itemHeight - scrollTop > this.presenter.height && top - itemHeight - this.presenter.lineHeight >= scrollTop) {
        top -= itemHeight + this.presenter.lineHeight;
      }
      overlayNode.style.top = top + 'px';
      return overlayNode.style.left = left + 'px';
    };

    return OverlayManager;

  })();

}).call(this);
