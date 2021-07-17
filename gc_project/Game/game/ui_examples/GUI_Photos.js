




var GUI_Photos = (function (_super) {
    __extends(GUI_Photos, _super);
    function GUI_Photos() {
        _super.call(this);
        this.on(EventObject.DISPLAY, this, this.refreshPhoto);
    }
    GUI_Photos.prototype.refreshPhoto = function () {
        var arr = [];
        for (var i = 0; i < Game.player.data.photos.length; i++) {
            var d = new ListItem_3;
            var photoID = Game.player.data.photos[i];
            var presetPhotoModule = GameData.getModuleData(1, photoID);
            d.pic = presetPhotoModule.picture;
            arr.push(d);
        }
        this.photoList.items = arr;
    };
    return GUI_Photos;
}(GUI_2));
//# sourceMappingURL=GUI_Photos.js.map