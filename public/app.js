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

        $('.alert-info').show();
        setTimeout(() => {
            $('.alert-info').hide();
        }, 500);

        setTimeout(() => {
            $.get("/api/saved/" + saveArticleId)
                .then(result => {
                    console.log(saveArticleId)
                    console.log(result);
                })
        }, 500);
    })

    $(document).on("click", "#delete-article-button", event => {
        console.log("Deleted This Article!");
        let clickedButton = event.target;
        console.log(clickedButton);
        let deleteId = $(clickedButton).data("id");
        console.log(deleteId);
        $(clickedButton).parent().parent().remove();

        $('.alert-warning').show();
        setTimeout(() => {
            $('.alert-warning').hide();
        }, 500);

        setTimeout(() => {
            $.get("/api/delete/" + deleteId)
                .then(result => {
                    console.log(result);
                })
        }, 500);
    })

})
