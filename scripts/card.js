function getDataHTML(data) {
    return `
    <div>
    ${data["text"]}
    </div>
    `
}

function getCardHTML(data) {
    return `
        <div id="stoneji-card" style="position: absolute;">
            <div id="stoneji-card-data">
            <h1>${data["text"]}</h1>
            ${getDataHTML(data)}
            </div>
        </div>
    `
}

Card.prototype.enable = function () {
    if (Date.now() - this.lastDisable > 50) {
        this.enabled = true;
        return true;
    }
    return false;
}

Card.prototype.disable = function () {
    this.enabled = false;
    if (this.el) {
        this.el.style.display = "none";
    }
}

Card.prototype.updateCursor = function (cursorX, cursorY) {
    this.cursorX = cursorX;
    this.cursorY = cursorY;

    if (this.el) {
        this.el.style.top = `${this.cursorY + 30}px`;
        this.el.style.left = `${this.cursorX + 30}px`;
    }
}

Card.prototype.updateTarget = function (target) {
    this.target = target;
    upc = this
    this.target.addEventListener("mouseleave", function leaveHandle(event) {
        upc.disable();
        upc.lastDisable = Date.now();
        this.removeEventListener("mouseleave", leaveHandle);
    })
}

Card.prototype.updateData = function (value) {
    this.data["text"] = value
    if (this.enable && this.el) {
        this.el.innerHTML = getCardHTML(this.data);
        this.el.style.display = "flex";
    }
}

function Card() {
    this.enabled = false;
    this.data = {}
    this.cursorX = 0;
    this.cursorY = 0;
    this.lastDisable = 0;
    this.el = document.createElement("div");
    this.el.style.position = "absolute";
    this.el.style.display = "none"
    this.el.innerHTML = getCardHTML(this.data);
    document.body.appendChild(this.el);
}

card = new Card();