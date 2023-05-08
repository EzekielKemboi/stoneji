function getUserProfileCardDataHTML(data) {
    return `
    <div>
    </div>
    `
}

function getUserProfileCardHTML(data) {
    return `
        <div id="biliscope-id-card" style="position: absolute;">
            <div id="biliscope-id-card-data">
            <h1>${data["text"]}</h1>
            ${getUserProfileCardDataHTML(data)}
            </div>
            <canvas id="word-cloud-canvas" style="width: 100%; height: 0"></canvas>
        </div>
    `
}

UserProfileCard.prototype.enable = function () {
    if (Date.now() - this.lastDisable > 50) {
        this.enabled = true;
        return true;
    }
    return false;
}

UserProfileCard.prototype.disable = function () {
    this.enabled = false;
    if (this.el) {
        this.el.style.display = "none";
    }
}

UserProfileCard.prototype.updateCursor = function (cursorX, cursorY) {
    this.cursorX = cursorX;
    this.cursorY = cursorY;

    if (this.el) {
        this.el.style.top = `${this.cursorY + 30}px`;
        this.el.style.left = `${this.cursorX + 30}px`;
    }
}

UserProfileCard.prototype.updateTarget = function (target) {
    this.target = target;
    upc = this
    this.target.addEventListener("mouseleave", function leaveHandle(event) {
        upc.disable();
        upc.lastDisable = Date.now();
        this.removeEventListener("mouseleave", leaveHandle);
    })
}

UserProfileCard.prototype.updateData = function (data) {
    this.data["text"] = data.value
    if (this.enable && this.el) {
        this.el.innerHTML = getUserProfileCardHTML(this.data);
        this.el.style.display = "flex";
    }
}

function UserProfileCard() {
    this.enabled = true;
    this.data = { "text": "输入您的stone记" }
    this.cursorX = 0;
    this.cursorY = 0;
    this.lastDisable = 0;
    this.el = document.createElement("div");
    this.el.style.position = "absolute";
    this.el.innerHTML = getUserProfileCardHTML(this.data);
    document.body.appendChild(this.el);
}

userProfileCard = new UserProfileCard();