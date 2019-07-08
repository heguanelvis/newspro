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
      .then(() => {})
      .catch(err => console.log(err));
  });

  $("#scrape-ok-button").click(() => {
    location.href = "/scraped";
  });

  $(document).on("click", "#save-article-button", event => {
    let clickedButton = event.target;
    let saved = $(clickedButton).data("save");
    saved = "true";
    let saveArticleId = $(clickedButton).attr("tempId");

    if (saved === "true") {
      $(clickedButton)
        .parent()
        .parent()
        .remove();

      if (saveArticleIdStr) {
        saveArticleIdArr = saveArticleIdStr.split(",");
      }
      saveArticleIdArr.push(saveArticleId);
      saveArticleIdStr = saveArticleIdArr.join();
      sessionStorage.setItem("saveArticleIdStr", saveArticleIdStr);
    }

    $.get("/api/saved/" + saveArticleId).then(() => {});

    swal(
      "Article Saved!",
      "Now go to Saved Articles to read your favorite articles!",
      "success"
    );
  });

  $(document).on("click", "#delete-article-button", event => {
    let clickedButton = event.target;
    let deleteId = $(clickedButton).data("id");

    $(clickedButton)
      .parent()
      .parent()
      .parent()
      .remove();

    $.get("/api/delete/" + deleteId).then(() => {});

    swal(
      "Article Deleted!",
      "Scrape and add more articles you like!",
      "warning"
    );
  });

  $(document).on("click", "#save-notes-button", event => {
    let clickedButton = event.target;
    let articleId = $(clickedButton).data("id");
    let notesTitle = $("#notes-title-" + articleId)
      .val()
      .trim();
    let notesText = $("#notes-text-" + articleId)
      .val()
      .trim();

    // Authentication of input:
    if (notesTitle != "" && notesText != "") {
      console.log("validated!");
      $.ajax({
        method: "POST",
        url: "/api/notes/" + articleId,
        data: {
          title: notesTitle,
          body: notesText
        }
      }).then(data => {});

      setTimeout(() => {
        $("#notes-title-" + articleId).val("");
        $("#notes-text-" + articleId).val("");
        swal(
          "Notes Saved!",
          "Have a look at the Notes to this Article!",
          "success"
        );

        setTimeout(() => {
          location.href = "/allsaved";
        }, 1000);
      }, 200);
    } else {
      swal(
        "Input Incomplete!",
        "You need to fill the required inputs!",
        "warning"
      );
    }
  });

  $(document).on("click", ".show-notes-button", event => {
    let clickedButton = event.target;
    let showNoteId = $(clickedButton).data("id");
    $("#note-info-modal-" + showNoteId).show();
  });

  $(document).on("click", ".hide-notes-button", event => {
    let clickedButton = event.target;
    let hideNoteId = $(clickedButton).data("id");
    $("#note-info-modal-" + hideNoteId).hide();
  });

  // save-note modal handler
  $(document).on("click", ".add-notes-button", event => {
    let backdrop = document.querySelector(".backdrop");
    let clickedButton = event.target;
    let addNoteId = $(clickedButton).data("id");
    let modal = document.querySelector("#save-note-modal-" + addNoteId);

    const openModal = () => {
      backdrop.style.display = "block";
      modal.style.display = "block";
    };
    const closeModal = () => {
      backdrop.style.display = "none";
      modal.style.display = "none";
    };

    openModal();
    backdrop.onclick = closeModal;
  });
});
