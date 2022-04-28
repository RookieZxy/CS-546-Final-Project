(function ($) {
  "use strict";

  $("#posterImg").hide();
  $("#imagesDiv").hide();

  $("#getImdb").click((e) => {
    e.preventDefault();
    let imdbId = $("#imdbId").val();

    if (!isValidString(imdbId)) {
      alert("Invalid IMDB Id");
      return;
    }

    $.ajax({
      method: "get",
      url: `http://localhost:3000/movie/imdb/${imdbId}`,
    })
      .then((data) => {
        console.log(data);
        $("#imdbId").attr("disabled", true);
        $("#getImdb").attr("disabled", true);
        autoFill(data);
      })
      .fail((error) => {
        alert(error);
      });
  });

  $("#myForm").submit(function (e) {
    e.preventDefault();
    // Get all the forms elements and their values in one step
    let formValues = $(this).serializeArray();
    let movie = {};
    for (let i = 0; i < formValues.length; i++) {
      let name = formValues[i].name;
      let val = formValues[i].value;
      if (name === "imdbId") continue;
      //validation
      if (!isValidString(val)) {
        alert(`${name} is not a valid string`);
        return;
      }
      movie[name] = val;
    }

    //validation
    if (movie.trailerLink) {
      if (!isValidHttpUrl(movie.trailerLink)) {
        alert("Invalid trailer Link. Please input a http url");
        $("#trailerLink").focus();
        return false;
      }
    }

    //typeList
    let typeList = [];
    debugger;
    const checkBoxInputs = $("#typeTheck input");
    for (let i = 1; i < checkBoxInputs.length; i++) {
      const checkBox = checkBoxInputs[i];

      if ($(checkBox).attr("checked")) {
        typeList.push($(checkBox).val());
      }
    }
    if (typeList.length === 0) {
      alert("Please select at least one type");
      $("#Comedy").focus();
      return;
    }
    movie.typeList = typeList;

    //poster
    movie.poster = $("#posterImg").prop("src");

    //images
    let images = [];
    let n = $("#images").prop("files").length;
    if (n !== 0) {
      for (let i = 0; i < n; i++) {
        let src = $(`#img${i}`).prop("src");
        images.push({
          title: i,
          image: src,
        });
      }
    }
    movie.images = images;

    console.log(movie);
  });

  $("#poster").change(function () {
    const poster = $("#poster").prop("files")[0];
    if (!isImage(poster)) {
      alert("Poster must be image file!");
      return;
    }
    setSrc(poster, "posterImg");
  });

  $("#images").change(function () {
    $("#imagesDiv").empty();
    const images = $("#images").prop("files");
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (!isImage(image)) {
        alert("Images must be image file!");
        return;
      }
      $("#imagesDiv").append(
        `<img src="" id="img${i}" class="rounded-top" alt="Sample image" width="300" height="300">`
      );
      setSrc(image, `img${i}`);
      $("#imagesDiv").show();
    }
  });

  $("#poster").change(function () {
    const poster = $("#poster").prop("files")[0];
    if (!isImage(poster)) {
      alert("Poster must be image file!");
      return;
    }
    setSrc(poster, "posterImg");
  });

  function isValidString(s) {
    if (typeof s === "string") {
      s = s.trim();
      if (s.length === 0) return false;
      else return true;
    } else return false;
  }

  function isImage(file) {
    if (!/image\/\w+/.test(file.type)) {
      return false;
    } else return true;
  }

  function setSrc(file, id) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (ev) => {
      // let baseURL = ev.target.result;
      $(`#${id}`).attr("src", ev.target.result);
      $(`#${id}`).show();
    };
  }

  function isValidHttpUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  function autoFill(movie) {
    $("#name").val(movie.name);
    $("#countries").val(movie.countries);
    //string
    $("#runtime").val(movie.runtime);
    $("#languages").val(movie.languages);
    $("#casts").val(movie.casts);
    $("#directors").val(movie.directors);
    $("#writers").val(movie.writers);
    $("#plot").val(movie.plot);
    $("#trailerLink").val(movie.trailerLink);
    $("#posterImg").attr("src", movie.poster);
    $("#posterImg").show();

    //type
    for (let i = 0; i < movie.typeList.length; i++) {
      const type = movie.typeList[i];
      $(`#${type}`).attr("checked", true);
    }
    //images
    for (let i = 0; i < movie.images.length; i++) {
      const image = movie.images[i];
      $("#imagesDiv").append(
        `<img src="${image.image}" id="img${i}" class="rounded-top" alt="Sample image" width="300" height="300">`
      );
      $("#imagesDiv").show();
    }
  }
})(jQuery);
