(function (angular) {
    "use strict";

    var app = angular.module("app", ["infinite-scroll", "ngAnimate"]);

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
                console.log("pard", url[5]);
            }

            $http.get(vm.url + tmpUrl)
                .then(function (response) {

                    vm.posts = response.data.posts;
                    vm.totalPages = response.data.pages;

                    $timeout(function () {
                        $(window).trigger('resize');
                    }, 0, false);


                    vm.loading = false;

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

        vm.selectedCategory = {id: 0, title: "All categories"};

        vm.categories = [];

        vm.posts = [];

        vm.allCategoryPostCount = 0;
        vm.allCategoryDescription = "";

        vm.sortedBy = "date";

        vm.totalPages = 0;
        vm.currentPage = 1;

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
                console.log(content);
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
                $($event.currentTarget).find("span").text($($.parseXML(result.data)).find("response_data").text().replace("+", ""));
            }, function (error) {
                console.log(error);
            });
        };

        vm.loadPosts = function () {
            console.log("loading post...");

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

                    console.log(vm.selectedCategory.id);
                    console.log(vm.allCategoryPostCount);
                    console.log(response);
                    console.log(category);

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
        }

    }

    function likes(content) {
        var parsed = $(content);

        return parsed.find(".count-box").text().replace("+", "");
    }

})(angular);