/**
 * 该文件为GameCreator编辑器自动生成的代码，请勿修改
 */

/**
 * 1-标题界面 [BASE]
 */
class GUI_1 extends GUI_BASE {
   title:UIString;
   title2:UIString;
   options:UIRoot;
   background:UIBitmap;
   btn1:UIButton;
   TWidthHeight:UIString;
   width:UIInput;
   height:UIInput;
   TType:UIString;
   type:UIComboBox;
   TFov:UIString;
   isFov:UICheckBox;
   TBox:UIString;
   isBox:UICheckBox;
   tguard:UIString;
   isGuard:UICheckBox;
   constructor(){
      super(1);
   }
}
class ListItem_1 extends UIListItemData {
   title:string;
   title2:string;
   background:string;
   TWidthHeight:string;
   width:string;
   height:string;
   TType:string;
   TFov:string;
   isFov:boolean;
   TBox:string;
   isBox:boolean;
   tguard:string;
   isGuard:boolean;
}

/**
 * 2- [BASE]
 */
class GUI_2 extends GUI_BASE {

   constructor(){
      super(2);
   }
}
class ListItem_2 extends UIListItemData {

}

/**
 * 3- [BASE]
 */
class GUI_3 extends GUI_BASE {

   constructor(){
      super(3);
   }
}
class ListItem_3 extends UIListItemData {

}
GameUI["__compCustomAttributes"] = {"UIRoot":["enabledLimitView","scrollShowType","hScrollBar","hScrollBg","vScrollBar","vScrollBg","scrollWidth","slowmotionType","enabledWheel","hScrollValue","vScrollValue"],"UIButton":["label","image1","grid9img1","image2","grid9img2","image3","grid9img3","fontSize","color","overColor","clickColor","bold","italic","smooth","align","valign","letterSpacing","font","textDx","textDy","textStroke","textStrokeColor"],"UIBitmap":["image","grid9","flip","pivotType"],"UIString":["text","fontSize","color","bold","italic","smooth","align","valign","leading","letterSpacing","font","wordWrap","overflow","shadowEnabled","shadowColor","shadowDx","shadowDy","stroke","strokeColor","onChangeFragEvent"],"UIVariable":["varID","fontSize","color","bold","italic","smooth","align","valign","leading","letterSpacing","font","wordWrap","overflow","shadowEnabled","shadowColor","shadowDx","shadowDy","stroke","strokeColor","onChangeFragEvent"],"UICustomGameNumber":["customData","previewNum","previewFixed","fontSize","color","bold","italic","smooth","align","valign","leading","letterSpacing","font","wordWrap","overflow","shadowEnabled","shadowColor","shadowDx","shadowDy","stroke","strokeColor"],"UICustomGameString":["customData","inEditorText","fontSize","color","bold","italic","smooth","align","valign","leading","letterSpacing","font","wordWrap","overflow","shadowEnabled","shadowColor","shadowDx","shadowDy","stroke","strokeColor"],"UIAvatar":["avatarID","scaleNumberX","scaleNumberY","orientationIndex","avatarFPS","playOnce","isPlay","avatarFrame","actionID","avatarHue"],"UIStandAvatar":["avatarID","actionID","scaleNumberX","scaleNumberY","flip","playOnce","isPlay","avatarFrame","avatarFPS","avatarHue"],"UIAnimation":["animationID","scaleNumberX","scaleNumberY","aniFrame","playFps","playType","showHitEffect","silentMode"],"UIInput":["text","fontSize","color","bold","italic","align","leading","font","wordWrap","restrict","inputMode","maxChars","shadowEnabled","shadowColor","shadowDx","shadowDy","onInputFragEvent","onEnterFragEvent"],"UICheckBox":["selected","image1","grid9img1","image2","grid9img2","onChangeFragEvent"],"UISwitch":["selected","image1","grid9img1","image2","grid9img2","previewselected","onChangeFragEvent"],"UITabBox":["selectedIndex","itemImage1","grid9img1","itemImage2","grid9img2","itemWidth","itemHeight","items","rowMode","spacing","labelSize","labelColor","labelFont","labelBold","labelItalic","smooth","labelAlign","labelValign","labelLetterSpacing","labelSelectedColor","labelDx","labelDy","labelStroke","labelStrokeColor","onChangeFragEvent"],"UISlider":["image1","bgGrid9","image2","blockGrid9","image3","blockFillGrid9","step","min","max","value","transverseMode","blockFillMode","blockPosMode","fillStrething","onChangeFragEvent"],"UIGUI":["guiID","instanceClassName","dpWidth"],"UIList":["itemModelGUI","previewSize","selectEnable","repeatX","itemWidth","itemHeight","spaceX","spaceY","scrollShowType","hScrollBar","hScrollBg","vScrollBar","vScrollBg","scrollWidth","selectImageURL","selectImageGrid9","selectedImageAlpha","selectedImageOnTop","overImageURL","overImageGrid9","overImageAlpha","overImageOnTop","overSelectMode","slowmotionType"],"UIComboBox":["itemLabels","selectedIndex","bgSkin","bgGrid9","fontSize","color","bold","italic","smooth","align","valign","letterSpacing","font","textDx","textStroke","textStrokeColor","displayItemSize","listScrollBg","listScrollBar","listAlpha","itemHeight","listBgColor","itemFontSize","itemColor","itemBold","itemItalic","itemAlign","itemValign","itemLetterSpacing","itemFont","itemOverColor","itemOverBgColor","itemTextDx","itemTextDy","itemTextStroke","itemTextStrokeColor","onChangeFragEvent"],"UIVideo":["videoURL","playType","volume","playbackRate","currentTime","muted","loop","pivotType","flip","onLoadedFragEvent","onErrorFragEvent","onCompleteFragEvent"]};
