(function ($) {
  "use strict";

  $("#posterImg").hide();
  $("#imagesDiv").hide();
  $("#success").hide();
  let _id = $("#_id").html();

  //get movie info
  $.ajax({
    method: "get",
    // url: `http://localhost:3000/movie/approveInfo/${_id}`,
    url: `/movie/approveInfo/${_id}`,
  })
    .then((data) => {
      let movie = data.movie;
      autoFill(movie);
    })
    .fail((error) => {
      alert(error.responseJSON.error);
    });

  //submit change
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

    //_id
    const idP = $("#_id");
    if (idP) movie._id = idP.html();

    //imdb id
    const imdbId = $("#imdbId").val();
    if (imdbId !== "") {
      movie.imdbId = imdbId;
    }

    //typeList
    let typeList = [];
    const checkBoxInputs = $("#typeTheck input");
    for (let i = 0; i < checkBoxInputs.length; i++) {
      const checkBox = checkBoxInputs[i];

      if ($(checkBox).is(":checked")) {
        typeList.push($(checkBox).val());
      }
    }
    if (typeList.length === 0) {
      alert("Please select at least one type");
      $("#ComedyCheckBox").focus();
      return;
    }
    movie.typeList = typeList;

    //poster
    movie.poster = $("#posterImg").prop("src");

    //images
    let images = [];
    const imgs = $("#imagesDiv img");
    for (let i = 0; i < imgs.length; i++) {
      const img = imgs[i];
      images.push({
        title: `${movie.name}_${i}`,
        image: $(img).prop("src"),
      });
    }
    movie.images = images;

    // console.log(movie);
    //ajax
    $.ajax({
      method: "post",
      // url: "http://localhost:3000/movie/manage",
      url: "/movie/manage",
      data: movie,
    })
      .then((data) => {
        alert("Success!");
        // $("#addDiv").hide();
        // $("#success").show();
        setTimeout(function () {
          window.location.replace(`/movie/${movie._id}`);
        }, 1000);
      })
      .fail((error) => {
        alert(error.responseJSON.error);
      });
  });

  $("#getImdb").click((e) => {
    e.preventDefault();
    let imdbId = $("#imdbId").val();

    if (!isValidString(imdbId)) {
      alert("Invalid IMDB Id");
      return;
    }

    $.ajax({
      method: "get",
      // url: `http://localhost:3000/movie/imdb/${imdbId}`,
      url: `/movie/imdb/${imdbId}`,
    })
      .then((data) => {
        if (data.isExisted) {
          alert(`Movie with IMDB id '${imdbId}' is existed`);
          window.location.replace(`/movie/${data.id}`);
        } else {
          $("#imdbId").attr("disabled", true);
          $("#getImdb").attr("disabled", true);
          autoFill(data);
        }
      })
      .fail((error) => {
        aalert(error.responseJSON.error);
      });
  });

  function autoFill(movie) {
    if (movie.imdbId) {
      $("#imdbId").val(movie.imdbId);
    }
    $("#name").val(movie.name);
    $("#countries").val(movie.countries);
    $("#releaseDate").val(movie.releaseDate);
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
      $(`#${type}CheckBox`).attr("checked", true);
    }
    //images
    for (let i = 0; i < movie.images.length; i++) {
      const image = movie.images[i];
      $("#imagesDiv").append(
        `<div class="col-sm-3" id="imagesDiv${i}">
          <img src="${image.image}" id="img${i}" class="rounded-top" alt="Sample image" width="300" height="300">
          <button class="w-100 btn btn-danger" id="delBtn${i}" onclick=>Delete</button>
        </div>`
      );
      //add click event
      const delBtns = $("#imagesDiv button");
      for (let i = 0; i < delBtns.length; i++) {
        const delBtn = delBtns[i];
        $(delBtn).click(function () {
          $(`#imagesDiv${i}`).remove();
        });
      }
      $("#imagesDiv").show();
    }
  }

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
        `<div class="col-sm-3" id="imagesDiv${i}">
          <img src="" id="img${i}" class="rounded-top" alt="Sample image" width="300" height="300">
          <button class="w-100 btn btn-danger" id="delBtn${i}" onclick=>Delete</button>
        </div>`
      );
      setSrc(image, `img${i}`);
    }
    //add click event
    const delBtns = $("#imagesDiv button");
    for (let i = 0; i < delBtns.length; i++) {
      const delBtn = delBtns[i];
      $(delBtn).click(function () {
        $(`#imagesDiv${i}`).remove();
      });
    }
    $("#imagesDiv").show();
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
})(jQuery);
