/**
 * @name The List Of All Possible QR-Codes (Complete)
 * @author a13ks3y.ass@gmail.com
 */
(function () {
    const debug = true; // @todo: move debug const to the config.js or something like this, maybe environment variable

    // @todo: don't run test on production? or run it? need to think about it...
    const testsIsPassed = test();
    (!testsIsPassed && !debug) && sorry();
    (debug || testsIsPassed) && main();

    function main() {
        console.info("The Program Is Started");

        // Read ur hash (the part after the first # (dies) character.
        const defaultUrlParams = {
            type: "url",
            data: "https://a13ks3y.github.io/qr",
        };

        const aHash = a2b(location.hash.substring(1));
        // @todo: do something with endless reloading page!!!1111
        if (aHash.length === 0) {
            location.href = location.href + "#" + b2a(JSON.stringify(defaultUrlParams));
            location.reload(true);
        }

        const urlParams = parseJSON(aHash);
        console.info("Url params:", urlParams);


        const qrCodeListElement = document.getElementById("qr-code-list");
        const qrCodeListItemElement = document.createElement("li");
        const qrCodeContainerElement = document.createElement("a");
        qrCodeContainerElement.setAttribute("href", defaultUrlParams.data);
        qrCodeListItemElement.appendChild(qrCodeContainerElement);
        qrCodeListElement.appendChild(qrCodeListItemElement);
        new QRCode(qrCodeContainerElement, {
            text: urlParams.data,
            colorLight: "#000",
            colorDark: "#f90"
        });
        // @todo: use window history changed event to handle hash changes on the page.
        const btnGo = document.getElementById("btn-go");
        const inputUrl = document.getElementById("input-url");
        btnGo.addEventListener("click", () => {
            location.href = location.href + "#" + b2a(JSON.stringify({
                type: "url",
                data: inputUrl.value
            }));
            location.reload(true);
        });

    }

    function sorry() {
        const sorryMessage = "Sorry! Can not run application, it's broken!";
        console.error(sorryMessage);
        !debug && alert(sorryMessage);
    }

    function renderQrCode(ctx, data, type) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
        return ctx;
        // Rendering some squares
    }

    // @todo: move this to the collection of useful scripts (create repo if not exist)
    function parseJSON(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.error(e);
            return {};
        }
    }

    function a2b(str) {
        try {
            return atob(str);
        } catch (e) {
            console.error(e);
            return "";
        }
    }

    function b2a(str) {
        try {
            return btoa(str);
        } catch (e) {
            console.error(e);
            return "";
        }
    }

    /**
     * Tests go first.
     * @name test
     * @return Boolean
     */
    function test(options = {
        verbose: true
    }) {
        const testResults = [
            {
                title: "Should render nothing if the given parameters (except ctx) are empty.",
                expected: "a canvas context, not changed at all.",
                assert: () => {
                    // arrange
                    const canvas = document.createElement("canvas");
                    canvas.setAttribute("width", "256");
                    canvas.setAttribute("height", "256");
                    const ctx = canvas.getContext("2d");
                    // act
                    const actualResult = renderQrCode(ctx);
                    // assert
                    const actualImageData = actualResult.getImageData(0,0,ctx.canvas.width, ctx.canvas.height);
                    const expectedImageData = ctx.getImageData(0,0,ctx.canvas.width, ctx.canvas.height);
                    for (let i = 0; i < actualImageData.data.length; i++) {
                        if (actualImageData.data[i] !== expectedImageData.data[i]) { return false; }
                    }
                    return true;
                }
            },
            {
                // @todo: finish the most important test!!!
                title: "Should render a QR-Code on the given canvas.",
                expected: "data:base64:blah-blah-blah",
                assert: () => {
                    // arrange
                    // act
                    // assert
                    return false; // @todo: implement renderQrCode function tests!
                }
            }
        ].map(theTest => runTest(theTest, options));
        options.verbose && console.table(testResults);
        // if at least one test is fails (not passed), then return false.
        return !testResults.some(theTestResult => !theTestResult.isPassed);
    }

    function runTest(theTest, options) {
        options.verbose && console.info(`The test ${theTest.title} is started.`);
        options.verbose && console.info(`Executing...`);
        const testResult = theTest.assert.call(theTest, options);
        return Object.assign({}, theTest, {
            assert: theTest.assert.toString(),
            isPassed: testResult
        });
    }
}());
