(function (angular) {
    "use strict";

    var app = angular.module("app", ["infinite-scroll", "ngAnimate", "ngTouch"]);

    app.config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
    });

    angular.module('app').controller('InterfacesController', InterfacesController);

    function InterfacesController($timeout, $location, $http, $httpParamSerializerJQLike) {
        var vm = this;

        vm.BASE_URL = "/woo";
        // vm.BASE_URL = "/wordpress";

        vm.url = "?json=get_posts&&count=16";


        vm.onLoad = function () {
            var url = $location.absUrl().split("/");

            var category = null;
            var product = null;

            var tmpUrl = "";

            if (url.length > 5) {
                vm.selectedCategory = {slug: url[4]};
                tmpUrl = "&category_name=" + vm.selectedCategory.slug;
            }

            if (url.length > 6) {
                product = url[5];
            }

            $http.get(vm.url + tmpUrl)
                .then(function (response) {

                    vm.posts = response.data.posts;
                    vm.totalPages = response.data.pages;


                    $timeout(function () {
                        $(window).trigger('resize');
                    }, 0, false);


                    if (product) {
                        $http.get(vm.url + vm.SELECT_BY_SLUG + product)
                            .then(function (response) {

                                if (response.data.count) {
                                    vm.openPost(response.data.posts[0], -1);
                                }

                                vm.loading = false;
                            });

                    } else {
                        vm.loading = false;
                    }

                    $(".posts-find").show();

                    if (vm.selectedCategory.slug && vm.posts.length > 0) {
                        vm.posts[0].categories.some(function (cat) {
                            if (cat.slug === vm.selectedCategory.slug) {
                                vm.selectedCategory = cat;
                                return true;
                            }
                        });
                    }


                    if (vm.selectedCategory.slug === undefined) {
                        vm.selectedCategory.post_count = response.data.count_total;
                        vm.allCategoryPostCount = response.data.count_total;

                    }
                });

            $http.get("?json=get_category_index")
                .then(function (response) {
                    vm.categories = response.data.categories;

                    vm.allCategoryDescription = vm.categories.pop().description;
                    if (vm.selectedCategory.title == "All categories") {
                        vm.selectedCategory.description = vm.allCategoryDescription;
                    }


                    if (vm.selectedCategory.slug !== undefined && vm.selectedCategory.id === undefined) {
                        vm.categories.some(function (cat) {
                            if (cat.slug === vm.selectedCategory.slug) {
                                vm.selectedCategory = cat;

                                $timeout(function () {
                                    $('.left-menu a').filter(function (index) {
                                        return $(this).text() && vm.selectedCategory.title && $(this).text().toLowerCase() === vm.selectedCategory.title.toLowerCase();
                                    }).trigger("selectItem");
                                    $("#magic-line").show();
                                }, 0, false);
                                return true;
                            }
                        });
                    } else {
                        $timeout(function () {
                            $('.left-menu a').filter(function (index) {
                                return $(this).text() && vm.selectedCategory.title && $(this).text().toLowerCase() === vm.selectedCategory.title.toLowerCase();
                            }).trigger("selectItem");
                            $("#magic-line").show();
                        }, 0, false);
                    }

                    $("#all-category").show();
                });
        };


        vm.COMPARE_BY_DATE = "&orderby=date";
        vm.COMPARE_BY_RATE = "&meta_key=_liked&orderby=meta_value_num";

        vm.SELECT_BY_SLUG = "&meta_key=slug&meta_value=";

        vm.selectedCategory = {id: 0, title: "All categories"};
        vm.selectedPost = null;

        vm.categories = [];

        vm.posts = [];

        vm.allCategoryPostCount = 0;
        vm.allCategoryDescription = "";

        vm.sortedBy = "date";

        vm.totalPages = 0;
        vm.currentPage = 1;

        vm.currentPostIndex = -1;

        vm.loading = true;

        vm.url = "?json=get_posts&&count=16";

        vm.onLoad();

        vm.getURL = function () {
            var url = vm.url;
            if (vm.selectedCategory.id) {
                url += "&cat=" + vm.selectedCategory.id;
            }

            if (vm.sortedBy === "date") {
                url += vm.COMPARE_BY_DATE;
            } else if (vm.sortedBy === "rate") {
                url += vm.COMPARE_BY_RATE;
            }

            return url;
        };

        vm.convertDate = function (date) {
            return new Date(date);
        };

        vm.liked = function (content) {
            if (content) {
                return content.indexOf("unlike") !== -1;
            } else {
            }
        };

        vm.likes = function (content) {
            return likes(content);
        };

        vm.like = function (post, action, $event) {

            var data = {
                action: "wp_ulike_process",
                id: post.id,
                type: "likeThis"
            };

            $http({
                method: 'POST',
                url: vm.BASE_URL + '/wp-admin/admin-ajax.php',
                data: $httpParamSerializerJQLike(data),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (result) {

                if (!action) {
                    $($event.currentTarget).addClass("liked");
                    post.content = "unlike";
                } else {
                    $($event.currentTarget).removeClass("liked");
                    post.content = "";
                }

                var likeCount = $($.parseXML(result.data)).find("response_data").text().replace("+", "");

                if ($("#post" + post.id + "-like")) {
                    $("#post" + post.id + "-like").text(likeCount);
                }

                if ($("#post" + post.id + "-like-modal")) {
                    $("#post" + post.id + "-like-modal").text(likeCount);
                }

                $($event.currentTarget).find("span").text($($.parseXML(result.data)).find("response_data").text().replace("+", ""));
            }, function (error) {
                console.log(error);
            });
        };

        vm.loadPosts = function () {

            if (vm.totalPages && vm.totalPages !== vm.currentPage) {
                vm.loading = true;
                vm.currentPage++;

                $http.get(vm.getURL() + "&page=" + vm.currentPage)
                    .then(function (response) {
                        vm.posts.push.apply(vm.posts, response.data.posts);
                        $timeout(function () {
                            $(window).trigger('resize');
                        }, 0, false);

                        vm.loading = false;

                    });
            }
        };

        vm.updateCategory = function (category) {

            vm.selectedCategory = category;
            window.history.pushState({"pageTitle": vm.selectedCategory.title}, "", "." + vm.BASE_URL + "/" + vm.selectedCategory.slug);

            //vm.posts = [];
            vm.loading = true;
            vm.currentPage = 1;

            $http.get(vm.getURL())
                .then(function (response) {
                    vm.posts = response.data.posts;
                    vm.totalPages = response.data.pages;
                    $timeout(function () {
                        $(window).trigger('resize');
                    }, 0, false);

                    vm.loading = false;

                    vm.posts_count = response.data.count_total;

                    if (vm.selectedCategory.id === 0 && vm.allCategoryPostCount === 0) {
                        vm.allCategoryPostCount = response.data.count_total;
                        vm.selectedCategory.post_count = response.data.count_total;
                    }
                });
        };


        vm.sortBy = function (sort) {
            if (sort !== vm.sortedBy) {

                vm.sortedBy = sort;

                vm.currentPage = 1;

                vm.loading = true;

                $http.get(vm.getURL())
                    .then(function (response) {
                        vm.posts = response.data.posts;
                        vm.totalPages = response.data.pages;

                        $timeout(function () {
                            $(window).trigger('resize');
                        }, 0, false);

                        vm.loading = false;

                    });
            }
        };

        vm.closePost = function () {
            if (vm.selectedCategory.slug) {
                window.history.pushState({"pageTitle": vm.selectedCategory.title}, "", "." + vm.BASE_URL + "/" + vm.selectedCategory.slug);
            } else {
                window.history.pushState({"pageTitle": vm.selectedCategory.title}, "", "." + vm.BASE_URL + "/");
            }

            vm.reloadPost();
            $("#content-section").removeClass("loading");
        };

        vm.reloadPost = function () {
            $(".play").removeClass("play-active");
            $(".mobile").removeClass("mobile-active");
            $("#modal-content").removeClass("mobile-modal-body");

            $("#video").empty();
            $("#myModal").hide();
            $('html, body').css('overflow', 'auto');
        };

        vm.openPost = function (post, index) {
            console.log(post);

            vm.selectedPost = post;
            vm.currentPostIndex = index;

            if (vm.selectedCategory.slug) {
                window.history.pushState({"pageTitle": vm.selectedPost.title}, "", "." + vm.BASE_URL + "/" + vm.selectedCategory.slug + "/" + vm.getSlug());
            } else {
                if (vm.selectedPost && vm.selectedPost.categories && vm.selectedPost.categories[0] && vm.selectedPost.categories[0].slug) {
                    window.history.pushState({"pageTitle": vm.selectedPost.title}, "", "." + vm.BASE_URL + "/" + vm.selectedPost.categories[0].slug + "/" + vm.getSlug());
                }
            }

            vm.hasMobile = vm.getImage("mobile");
            vm.hasVideo = vm.getUrl('video');


            $("#video").empty();
            vm.loading = true;
            $("#screenshot").addClass("loading");
            $("#screenshot").attr("src", vm.getImage("desktop"));
            $("#screenshot").show();
            $("#myModal").show();
            $('html, body').css('overflow', 'hidden');

        };

        vm.previousPost = function () {
            if (vm.currentPostIndex > 0) {
                vm.openPost(vm.posts[--vm.currentPostIndex], vm.currentPostIndex);
            }
        };

        vm.nextPost = function () {
            console.log(vm.currentPostIndex);
            console.log(vm.posts.length);
            if (vm.currentPostIndex < vm.posts.length - 1) {
                vm.openPost(vm.posts[++vm.currentPostIndex], vm.currentPostIndex);
            }
        };

        vm.getImage = function (name) {
            if ($(window).width() > 480) {
                name += "-image";
            } else {
                name = "mobile-image"
            }

            var post = vm.selectedPost;

            if (post && post.custom_fields && post.custom_fields[name] && post.custom_fields[name][0]) {

                var res = post.attachments.filter(function (attachment) {
                    return attachment.id == post.custom_fields[name][0];
                });

                return res && res[0] && res[0].url ? res[0].url : "";
            }

            return null;
        };

        vm.getUrl = function (name) {
            name += "-url";
            var post = vm.selectedPost;

            return post && post.custom_fields && post.custom_fields[name] && post.custom_fields[name][0] ? post.custom_fields[name][0] : null;
        };

        vm.getSlug = function () {
            var name = "slug";
            var post = vm.selectedPost;

            return post && post.custom_fields && post.custom_fields[name] && post.custom_fields[name][0] ? post.custom_fields[name][0] : "";
        };

        vm.hasVideo = false;
        vm.hasMobile = false;

        vm.loadVideo = function () {
            if (vm.hasVideo) {
                $(".play").toggleClass("play-active");

                if ($(".play").hasClass("play-active")) {
                    $("#screenshot").hide();


                    if ($(".mobile").hasClass("mobile-active")) {
                        $("#video").html('<iframe width="100%" height="567" src="https://player.vimeo.com/video/'
                            + getVimeoId(vm.getUrl('mobile-video')) + '?autoplay=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')

                    } else {
                        $("#video").html('<iframe width="100%" height="567" src="https://player.vimeo.com/video/'
                            + getVimeoId(vm.getUrl('video')) + '?autoplay=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')

                    }
                    $("#video").show();

                    vm.hasMobile = vm.getUrl("video");
                } else {
                    vm.hasMobile = vm.getImage("mobile");
                    vm.hasVideo = vm.getUrl("video");
                    $("#video").empty();

                    vm.loading = true;
                    $("#screenshot").addClass("loading");
                    if ($(".mobile").hasClass("mobile-active")) {
                        $("#screenshot").attr("src", vm.getImage("mobile"));
                    } else {
                        $("#screenshot").attr("src", vm.getImage("desktop"));
                    }
                    $("#screenshot").show();
                }
            }
        };

        vm.loadMobile = function () {
            if (vm.hasMobile) {
                $(".mobile").toggleClass("mobile-active");

                if ($(".mobile").hasClass("mobile-active")) {
                    $("#modal-content").addClass("mobile-modal-body");

                    vm.hasVideo = vm.getUrl("mobile-video");

                    if ($(".play").hasClass("play-active")) {
                        $("#screenshot").hide();
                        $("#video").html('<iframe width="100%" height="567" src="https://player.vimeo.com/video/'
                            + getVimeoId(vm.getUrl('mobile-video')) + '?autoplay=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
                        $("#video").show();
                    } else {
                        $("#video").empty();
                        vm.loading = true;
                        $("#screenshot").addClass("loading");
                        $("#screenshot").attr("src", vm.getImage("mobile"));
                        $("#screenshot").show();
                    }

                } else {
                    $("#modal-content").removeClass("mobile-modal-body");
                    vm.hasVideo = vm.getUrl("video");

                    if ($(".play").hasClass("play-active")) {
                        $("#screenshot").hide();
                        $("#video").html('<iframe width="100%" height="567" src="https://player.vimeo.com/video/'
                            + getVimeoId(vm.getUrl('video')) + '?autoplay=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
                        $("#video").show();
                    } else {
                        $("#video").empty();
                        vm.loading = true;
                        $("#screenshot").addClass("loading");
                        $("#screenshot").attr("src", vm.getImage("desktop"));
                        $("#screenshot").show();
                    }

                }
            }
        };

        vm.getTitleImage = function (post) {
            var name = "title-image";

            if (post && post.custom_fields && post.custom_fields[name] && post.custom_fields[name][0]) {

                var res = post.attachments.filter(function (attachment) {
                    return attachment.id == post.custom_fields[name][0];
                });

                return res && res[0] && res[0].url ? res[0].url : "";
            }

            return null;
        };

        window.onclick = function (event) {
            if (event.target == document.getElementById('myModal')) {
                vm.closePost();
            }
        };

        $("#screenshot").load(function () {
            $(".spinner").hide();
            $("#content-section").removeClass("loading");
            $("#screenshot").removeClass("loading");
            vm.loading = false;
        })
    }

    function likes(content) {
        var parsed = $(content);

        return parsed.find(".count-box").text().replace("+", "");
    }

    function getVimeoId(url) {
        var regExp = /http(s)?:\/\/(www\.)?vimeo.com\/(\d+)(\/)?(#.*)?/

        var match = url.match(regExp)

        if (match)
            return match[3]
    }

})(angular);