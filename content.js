if (document.URL.startsWith("https://ict-i.el.kyutech.ac.jp/course/view.php?id=")) {
    var subjectId = document.URL.substring(document.URL.indexOf("=") + 1);
    if (subjectId.includes("#")) {
        subjectId = subjectId.substring(0, subjectId.indexOf("#"))
    }
    if (subjectId.includes("&")) {
        subjectId = subjectId.substring(0, subjectId.indexOf("&"))
    }

    if (isNaN(subjectId)) {
        console.warn("Unable to parse subject id (" + subjectId + ")")
    } else {
        const title = document.title.substring(document.title.indexOf(":") + 2)

        chrome.storage.local.get("subjectNames", function (result) {
            var map = result.subjectNames

            if (map == undefined || map == null) {
                map = {}
            }
            map[subjectId] = title
            chrome.storage.local.set({ subjectNames: map }, function () { console.log("Saved " + title + " as " + subjectId) });
        })
    }
}

const navs = document.getElementById("nav-drawer").children
var nav = null
for (const item of navs) {
    const attribute = item.getAttribute("aria-label")
    if (attribute != null && attribute == "サイト") {
        nav = item
    }
}

if (nav == null) {
    console.log("Could not find the nav.")
} else {
    const items = nav.querySelector("ul").children;

    chrome.storage.local.get("subjectNames", function (result) {
        var nameMap = result.subjectNames

        if (nameMap == undefined || nameMap == null) {
            nameMap = {}
        }

        for (const item of items) {
            var link = item.querySelector("a")
            if (link == null) {
                continue;
            }

            var dataType = link.getAttribute("data-type")

            if (parseInt(dataType, 10) != 20) {
                continue;
            }

            const subjectId = parseInt(link.getAttribute("data-key"), 10)
            try {
                const subjectName = nameMap[subjectId]
                if (subjectName == null) {
                    continue;
                }

                const mediaBody = link.querySelector(".media-body")
                if (mediaBody != null) {
                    mediaBody.textContent = subjectName
                }
            } catch (error) {
                console.log(error)
            }
        }
    });
}
