var CumtomDataDisplay;
(function (CumtomDataDisplay) {
    function f1(trigger, p) {
        if (p.type == 0) {
            return Game.player.data.photos.length;
        }
        else {
            return ArrayUtils.getElementSize(Game.player.data.photos, p.photo);
        }
    }
    CumtomDataDisplay.f1 = f1;
})(CumtomDataDisplay || (CumtomDataDisplay = {}));
//# sourceMappingURL=CumtomDataDisplay.js.map