interface State {
    
    onEnter();

    onExit();
}

abstract class AbstractPage extends egret.Sprite implements State {


    onEnter() {

    }

    onExit() {

    }
}


class PageContainer extends egret.DisplayObjectContainer {

    private _pageList: AbstractPage[] = [];

    private _currentIndex = 0;

    private _touchBeginLocationY = 0;

    private _touchDistance = 0;

    private static HEIGHT = 1136;

    constructor() {
        super();
        this.addListener();
        this.touchEnabled = true;

        this._pageList = [new FirstPage(), new SecondPage(), new ThirdPage()];
        this.updatePagePosition();
        this.updatePageDepth();
        this._pageList[0].onEnter();

    }

    private addListener() {
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => {
            this._touchBeginLocationY = e.stageY;
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler, this);
        }, this);

        this.addEventListener(egret.TouchEvent.TOUCH_END, (e) => {
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler, this);
            this.onTouchEndHandler(e);
        }, this);
    }

    private onTouchEndHandler(e: egret.TouchEvent) {

        var currentPage = this._pageList[this._currentIndex];
        var nextPage = this._pageList[this._currentIndex + 1];
        var prevPage = this._pageList[this._currentIndex - 1];

        if (this._touchDistance <= -PageContainer.HEIGHT / 2 && nextPage) {
            egret.Tween.get(currentPage).to({ y: -PageContainer.HEIGHT }, 300).call(() => {
                this.updatePagePosition();
                this.changePage("next");
                this.updatePageDepth();
            }, this).addEventListener("change", () => {
                this.updatePagePosition();
            }, this)
        }
        else if (this._touchDistance >= PageContainer.HEIGHT / 2 && prevPage) {
            egret.Tween.get(currentPage).to({ y: PageContainer.HEIGHT }, 300).call(() => {
                this.updatePagePosition();
                this.changePage("prev");
                this.updatePageDepth();
            }, this).addEventListener("change", () => {
                this.updatePagePosition();
            }, this)
        }
        else {
            egret.Tween.get(currentPage).to({ y: 0 }, 300).call(() => {
                this.updatePagePosition();
            }, this).addEventListener("change", () => {
                this.updatePagePosition();
            }, this)
        }
    }

    private onTouchMoveHandler(e: egret.TouchEvent) {
        var currentPage = this._pageList[this._currentIndex];
        this._touchDistance = e.stageY - this._touchBeginLocationY;
        currentPage.y = this._touchDistance;
        this.updatePagePosition();
    }

    private updatePageDepth() {
        var currentPage = this._pageList[this._currentIndex];
        var prevPage = this._pageList[this._currentIndex - 1];
        var nextPage = this._pageList[this._currentIndex + 1];
        this.removeChildren();
        if (prevPage) {
            this.addChild(prevPage);
        }
        this.addChild(currentPage);
        if (nextPage) {
            this.addChild(nextPage);
        }
    }

    private updatePagePosition() {
        var currentPage = this._pageList[this._currentIndex];
        var prevPage = this._pageList[this._currentIndex - 1];
        if (prevPage) {
            prevPage.y = currentPage.y - PageContainer.HEIGHT;
        }
        var nextPage = this._pageList[this._currentIndex + 1];
        if (nextPage) {
            nextPage.y = currentPage.y + PageContainer.HEIGHT;
        }
    }

    changePage(mode: "next" | "prev") {
        var currentPage = this._pageList[this._currentIndex];
        var prevPage = this._pageList[this._currentIndex - 1];
        var nextPage = this._pageList[this._currentIndex + 1];
        if (mode == "next") {
            currentPage.onExit();
            this._currentIndex++;
            nextPage.onEnter();
        }
        else if (mode == "prev") {
            currentPage.onExit();
            this._currentIndex--;
            prevPage.onEnter();
        }
    }
}


class FirstPage extends AbstractPage {

    private textField: egret.TextField;

    constructor() {
        super();
        var rect = new egret.Shape();
        rect.graphics.beginFill(0xfff00, .8);
        rect.graphics.drawRect(0, 0, 640, 1136);
        rect.graphics.endFill();
        this.addChild(rect);
    }


    onEnter() {
        this.textField = new egret.TextField();
        this.textField.text = "Hello World";
        this.addChild(this.textField);
        this.textField.y = 500;
        this.textField.width = 640;
        this.textField.textAlign = egret.HorizontalAlign.CENTER;
    }

    onExit() {
        this.removeChild(this.textField);
    }

}

class SecondPage extends AbstractPage {
    constructor() {
        super();
        var rect = new egret.Shape();
        rect.graphics.beginFill(0xff00ff, 1);
        rect.graphics.drawRect(0, 0, 640, 1136);
        rect.graphics.endFill();
        this.addChild(rect);
    }

    onEnter() {

    }

    onExit() {

    }

}

class ThirdPage extends AbstractPage {
    constructor() {
        super();
        var rect = new egret.Shape();
        rect.graphics.beginFill(0xffffff, 1);
        rect.graphics.drawRect(0, 0, 640, 1136);
        rect.graphics.endFill();
        this.addChild(rect);
    }


    onEnter() {

    }

    onExit() {

    }

}