/*
 * Blog Controller
 * purpose: To display articles from my blog.
 * 
 */

function _stripHTML(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function _makeArticles(wpArticles) {
  var blogContainer = document.getElementById("blogContainer");
  var articles = blogContainer.getElementsByClassName("article");
  
  for (index = 0; index < wpArticles.length; index++) {
    var article = articles[index];
    var articleTitle = article.children[1].children[0].children[0];
    var articleDate = article.children[1].children[0].children[1];
    var articleSummary = article.children[1].children[1];
    var date = new Date(wpArticles[index].modified);

    // Article image
    if (document.documentElement.clientWidth > 480 && wpArticles[index].featured_media !== 0) {
      var ob = {
        url: wpArticles[index]._links['wp:featuredmedia'][0].href,
        ref: article
      }; 
      $ajax(ob, function (err, image, article) {
        article.children[0].style.backgroundImage = "url(" + image.media_details.sizes.medium.source_url + ")";
        article.children[0].style.backgroundSize = "cover";
      });
    }

    // Article Text, Date and Summary
    articleTitle.innerHTML = wpArticles[index].title.rendered;
    articleDate.innerHTML = date.toDateString();
    articleSummary.innerHTML = _stripHTML(wpArticles[index].content.rendered).substring(0,100);

    // Link binding to article
    article.dataset.link = wpArticles[index].link;
    article.addEventListener('click', function () {
      window.open(this.dataset.link, '_blank');
    });

  }

  // 4th article links to blog
  articles[3].addEventListener('click', function () {
    window.open('http://designedbyashw.in/blog', '_blank');
  });
}

// Ajax : Get latest 3 articles
$ajax('http://designedbyashw.in/blog/wp-json/wp/v2/posts?per_page=3', function (err, response) {
  _makeArticles(response);
});


