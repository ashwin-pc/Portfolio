/*
 * Blog Controller
 * purpose: To display articles from my blog.
 * 
 */

function _makeArticles(articleArr) {
  var blogContainer = document.getElementById("blogContainer");
  var articles = blogContainer.getElementsByClassName("article");
  articleArr.forEach(function (articleObj, index) {
    var articleTitle = articles[index].children[1].children[0].children[0];
    var articleDate = articles[index].children[1].children[0].children[1];
    var articleSummary = articles[index].children[1].children[1];
    var date = new Date(articleObj.modified);

    // Article image
    if (document.documentElement.clientWidth > 480 && articleObj.featured_media !== 0) {
      $ajax(articleObj._links['wp:featuredmedia'][0].href, function (err, image) {
        articles[index].children[0].style.backgroundImage = "url(" + image.media_details.sizes.thumbnail.source_url + ")";
        articles[index].children[0].style.backgroundSize = "cover";
      });
    }

    // Article Text
    console.log(articleObj);
    articleTitle.innerHTML = articleObj.title.rendered;
    
    articleDate.innerHTML = date.toDateString();

  });
}

// Ajax : Get latest 3 articles
$ajax('http://designedbyashw.in/blog/wp-json/wp/v2/posts?per_page=3', function (err, response) {
  _makeArticles(response);
});


