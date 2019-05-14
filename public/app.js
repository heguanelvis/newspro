$("document").ready(() => {

    let saveArticleIdArr = [];
    let saveArticleIdStr = sessionStorage.getItem("saveArticleIdStr");
    if (saveArticleIdStr) {
        needToDeleteArr = saveArticleIdStr.split(",");
        needToDeleteArr.map(i => $("#id-" + i).remove());
    }

    $("#scrape-button").click(() => {
        sessionStorage.clear();

        $.get("/api-scrape")
            .then(result => {
                if (result) {
                    console.log(result);
                }
            })
            .catch(err => console.log(err))
    });

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
            sessionStorage.setItem("saveArticleIdStr", saveArticleIdStr);
        }

        setTimeout(() => {
            $.get("/api/saved/" + saveArticleId)
                .then(result => {
                    console.log(saveArticleId);
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
        let notesTitle = $("#notes-title-" + articleId).val().trim();
        let notesText = $("#notes-text-" + articleId).val().trim();
        console.log(notesTitle, notesText);

        // Authentication of input:
        if (notesTitle != "" && notesText != "") {
            console.log("validated!")
            $.ajax({
                method: "POST",
                url: "/api/notes/" + articleId,
                data: {
                    title: notesTitle,
                    body: notesText
                }
            })
                .then(data => {
                    console.log(data);
                });

            setTimeout(() => {
                $("#notes-title-" + articleId).val("");
                $("#notes-text-" + articleId).val("");
                swal("Notes Saved!", "Have a look at the Notes to this Article!", "success")

                setTimeout(() => {
                    location.href = "/allsaved";
                }, 1000);

            }, 200);

        } else {
            console.log("Required not filled!");
            swal("Input Incomplete!", "You need to fill the required inputs!", "warning")
        }
    });

    $(document).on("click", ".show-notes-button", event => {
        console.log("worked?")
        let clickedButton = event.target;
        let showNoteId = $(clickedButton).data("id");
        $("#note-info-modal-" + showNoteId).show();
    });

    $(document).on("click", ".hide-notes-button", event => {
        console.log("worked?")
        let clickedButton = event.target;
        let hideNoteId = $(clickedButton).data("id");
        $("#note-info-modal-" + hideNoteId).hide();
    })

    // save-note modal handler
    $(document).on("click", ".add-notes-button", event => {
        let backdrop = document.querySelector('.backdrop');
        let clickedButton = event.target;
        let addNoteId = $(clickedButton).data("id");
        let modal = document.querySelector("#save-note-modal-" + addNoteId);
        const openModal = () => {
            backdrop.style.display = 'block';
            modal.style.display = 'block';
        }
        const closeModal = () => {
            backdrop.style.display = 'none';
            modal.style.display = 'none';
        }
        openModal();
        backdrop.onclick = closeModal;
    })

})
