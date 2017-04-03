(function (angular) {
    "use strict";

    var app = angular.module("app", ["infinite-scroll", "ngAnimate"]);

    app.config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
    });

    angular.module('app').controller('InterfacesController', InterfacesController);

    function InterfacesController($timeout, $location, $http, $httpParamSerializerJQLike) {
        var vm = this;

        // vm.BASE_URL = "/woo";
        vm.BASE_URL = "/wordpress";

        vm.url = "?json=get_posts&&count=16";


        vm.onLoad = function () {
            var url = $location.absUrl().split("/");

            var category = null;
            var product = null;

            var tmpUrl = "";

            if (url.length > 5) {
                category = url[4];
                vm.selectedCategory = null;
                //vm.selectedCategory = category;
                tmpUrl = "&category_name=" + category;
            }

            if (url.length > 6) {
                product = url[5];
                console.log("pard", url[5]);
            }

            $http.get(vm.url + tmpUrl)
                .then(function (response) {

                    vm.posts_count = response.data.count_total;
                    vm.posts = response.data.posts;
                    vm.totalPages = response.data.pages;

                    $timeout(function () {
                        $(window).trigger('resize');
                    }, 0, false);


                    vm.loading = false;

                    $(".posts-find").show();
                    if (category && vm.posts.length > 0) {
                        vm.posts[0].categories.some(function (cat) {
                            if (cat.slug === category) {
                                vm.selectedCategoryId = cat.id;
                                vm.selectedCategory = cat.title;
                                vm.selectedCategoryDescription = cat.description;
                                return true;
                            }
                        });
                    } else {
                        vm.selectedCategory = null;
                    }
                });

            $http.get("?json=get_category_index")
                .then(function (response) {
                    $("#all-category").show();
                    vm.categories = response.data.categories;

                    if (!vm.selectedCategory) {
                        vm.categories.some(function (cat) {
                            if (cat.slug.trim() === category.trim()) {
                                vm.selectedCategoryId = cat.id;
                                vm.selectedCategory = cat.title;
                                vm.selectedCategoryDescription = cat.description;

                                $timeout(function () {
                                    $('.left-menu a').filter(function (index) {
                                        console.log(vm.selectedCategory, $(this).text());
                                        return $(this).text() && vm.selectedCategory && $(this).text().toLowerCase() === vm.selectedCategory.toLowerCase();
                                    }).trigger("selectItem");
                                    $("#magic-line").show();
                                }, 0, false);
                                return true;
                            }
                        });
                    } else {
                        $timeout(function () {
                            $('.left-menu a').filter(function (index) {
                                console.log("11", vm.selectedCategory, $(this).text());
                                return $(this).text() && vm.selectedCategory && $(this).text().toLowerCase() === vm.selectedCategory.toLowerCase();
                            }).trigger("selectItem");
                            $("#magic-line").show();
                        }, 0, false);
                    }

                });
        };


        vm.COMPARE_BY_DATE = "&orderby=date";
        vm.COMPARE_BY_RATE = "&meta_key=_liked&orderby=meta_value_num";

        vm.selectedCategory = "All categories";
        vm.selectedCategoryId = 0;
        vm.selectedCategoryDescription = "";
        vm.allCategoryPostCount = 0;
        vm.categories = [];

        vm.posts = [];

        vm.posts_count = 0;


        vm.sortedBy = "date";

        vm.totalPages = 0;
        vm.currentPage = 1;

        vm.loading = true;

        vm.url = "?json=get_posts&&count=16";

        vm.onLoad();

        vm.getURL = function () {
            var url = vm.url;
            if (vm.selectedCategoryId) {
                url += "&cat=" + vm.selectedCategoryId;
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

        vm.updateCategory = function (categoryId, categorySlug, categoryName, categoryDescription, count) {
            window.history.pushState({"pageTitle": categoryName}, "", "." + vm.BASE_URL + "/" + categorySlug);
            vm.selectedCategory = categoryName;
            vm.selectedCategoryDescription = categoryDescription;

            vm.posts_count = count;
            if (!categoryId) {
                vm.posts_count = vm.allCategoryPostCount;
            }
            //vm.posts = [];
            vm.loading = true;
            vm.currentPage = 1;

            vm.selectedCategoryId = categoryId;

            $http.get(vm.getURL())
                .then(function (response) {
                    vm.posts = response.data.posts;
                    vm.totalPages = response.data.pages;
                    $timeout(function () {
                        $(window).trigger('resize');
                    }, 0, false);

                    vm.loading = false;

                    vm.posts_count = response.data.count_total;

                    if (!categoryId && !vm.allCategoryPostCount) {
                        vm.allCategoryPostCount = response.data.count_total;
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