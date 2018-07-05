$("document").ready(() => {

    let saveArticleIdArr = [];
    let saveArticleIdStr = sessionStorage.getItem("saveArticleIdStr")
    if (saveArticleIdStr) {
        needToDeleteArr = saveArticleIdStr.split(",");
        needToDeleteArr.map(i => $("#id-" + i).remove());
    }


    console.log("Page Loaded")
    $("#scrape-button").click(() => {
        sessionStorage.clear();
        console.log("Clicked Scrape Articles!")
        $.get("/api-scrape")
            .then(result => {
                if (result) {
                    console.log(result);
                }
            })
            .catch(err => console.log(err))
    })

    $("#scrape-ok-button").click(() => {
        location.href = "/scraped";
    })

    $(document).on("click", "#save-article-button", event => {
        console.log("Saved This Article!");
        let clickedButton = event.target;
        console.log(clickedButton);
        let saved = $(clickedButton).data("save");
        console.log(saved)
        saved = "true";
        let saveArticleId = $(clickedButton).attr("tempId");
        console.log(saveArticleId)
        if (saved === "true") {
            $(clickedButton).parent().parent().remove();
            if (saveArticleIdStr) {
                saveArticleIdArr = saveArticleIdStr.split(",")
            }
            saveArticleIdArr.push(saveArticleId);
            saveArticleIdStr = saveArticleIdArr.join();
            sessionStorage.setItem("saveArticleIdStr", saveArticleIdStr)
        }

        setTimeout(() => {
            $.get("/api/saved/" + saveArticleId)
                .then(result => {
                    console.log(saveArticleId)
                    console.log(result);
                })
            setTimeout(() => {
                swal("Article Saved!", "Now go to Saved Articles to read your favorite articles!", "success");
            }, 200);
        }, 500);
    })

    $(document).on("click", "#delete-article-button", event => {
        console.log("Deleted This Article!");
        let clickedButton = event.target;
        console.log(clickedButton);
        let deleteId = $(clickedButton).data("id");
        console.log(deleteId);
        $(clickedButton).parent().parent().parent().remove();

        setTimeout(() => {
            $.get("/api/delete/" + deleteId)
                .then(result => {
                    console.log(result);
                })
            setTimeout(() => {
                swal("Article Deleted!", "Scrape and add more articles you like!", "warning");
            }, 200);
        }, 500);
    })

    $(document).on("click", "#save-notes-button", event => {
        console.log("Saved This Note!");
        let clickedButton = event.target;
        let articleId = $(clickedButton).data("id");
        console.log(articleId);
        let notesTitle = $("#notes-title-"+articleId).val().trim();
        let notesText = $("#notes-text-"+articleId).val().trim();
        console.log(notesTitle, notesText);
        // Authentication of input:
        if (notesTitle != "" && notesText != "") {
            console.log("validated!")
        } else {
            console.log("Required not filled!");
            swal("Input Incomplete!", "You need to fill the required inputs!", "warning")
        }
    })


})
