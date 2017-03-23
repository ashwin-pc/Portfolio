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
    var date = new Date(wpArticles[index].date);

    // Article image
    if (!_mobile && wpArticles[index].featured_media !== 0) {
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
    articleSummary.innerHTML = _stripHTML(wpArticles[index].excerpt.rendered).substring(0,100);

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
$ajax('http://designedbyashw.in/blog/wp-json/wp/v2/posts?per_page=3&context=embed', function (err, response) {
  if (err) {
    errorToast("Could not retrieve Posts, Try again.")
    return;
  }
  _makeArticles(response);
});

function _blogScrollHandler() {
  // Get Visibility Percent of the Section
  var sectionVisiblePercent = getSectionVisiblePercent(2);
  var articles = document.getElementsByClassName("article");

  if (sectionVisiblePercent > 90) {
    [].forEach.call(articles, function (article, i) {
      setTimeout(function() {
        article.classList.add("animate");
      }, 100 * i);
    });
  } else {
    [].forEach.call(articles, function (article, i) {
      setTimeout(function() {
        article.classList.remove("animate");
      }, 100 * i);
    });
  }
}
