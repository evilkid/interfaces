<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interfaces</title>
    <base href="/wordpress">
    <?php wp_head(); ?>

</head>
<body ng-app="app" ng-controller="InterfacesController as vm" infinite-scroll="vm.loadPosts()"
      infinite-scroll-disabled='vm.loading' infinite-scroll-distance="0.5">
    <header>
        <div class="container">
            <div onclick="window.location='/woo'" class="logo">
            </div>
            <a href="#" class="hamburger-menu">
                <span></span>
            </a>
            <nav class="head-navigation">
                <a href="#" class="submit clearfix">
                    <svg width="20px" height="20px">
                        <path d="M10,8.5 L10,14 L5,14 L5,8.5 L2.5,8.5 L7.5,3 L12.5,8.5 L10,8.5 Z" id="Combined-Shape">
                        </path>
                        <rect id="Rectangle-22" x="0" y="0" width="15" height="2">
                        </rect>
                    </svg>
                    <span>Submit</span>
                </a>
                <div class="head-links">
                    <a href="#">Brands</a>
                    <a href="#">About</a>
                    <a href="#">Contacts</a>
                </div>
                <a href='#' class="twitter"><i class="fa fa-twitter" aria-hidden="true"></i></a>
                <a href='#' class="subscribe">Subscribe</a>
            </nav>
        </div>
    </header>
    <main>
        <div class="head-navigation-mobile">
            <ul>
                <li><a href="#" class="active-link-head-navigation-mobile">Home</a></li>
                <li><a href="#">Brands</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contacts</a></li>
                <li id='mobile-magic-line'></li>
            </ul>
            <div class="link-mob"><a href="#">Privacy</a>
                <a href="#">Terms</a></div>
            <button class="subscribe-mobile">Subscribe</button>
        </div>
        <div class="left-side" ng-cloak>
            <div class="main-content-navigation">
                <ul class="left-menu" id="left-menu" onmousewheel="event.stopPropagation()">
                    <li id="all-category"><a href='#'
                                             ng-class="{active: 'All categories' === vm.selectedCategory.title}"
                                             ng-click="vm.updateCategory({id: 0, slug: '', title: 'All categories',
                                             post_count: vm.allCategoryPostCount, description: vm.allCategoryDescription})">All
                            categories</a></li>
                    <li ng-repeat="c in vm.categories"
                        ng-click="vm.updateCategory(c)">
                        <a href
                           ng-class="{active: c.slug.toLowerCase() === vm.selectedCategory.slug.toLowerCase()}">{{c.title}}</a>
                    </li>
                    <li id='magic-line'></li>
                </ul>
                <div class="no-results">
                    <p>¯\_(ツ)_/¯<br>
                        Sorry, no results<br>
                        <span>try some other query</span>
                    </p>
                </div>
                <div class="search-category">
                    <input type="text" placeholder="find a category">
                    <div class="search active-input"></div>
                    <div class="cross"></div>
                </div>
            </div>
            <div class="bottom-left-nav">
                <a href="#">Privacy</a>
                <span>&#8226;</span>
                <a href="#">Terms</a>
            </div>
        </div>
        <div class="main-content" ng-cloak>
            <div class="top-content-panel clearfix">
                <div class="posts-find">{{vm.selectedCategory.title}} <span>({{vm.selectedCategory.post_count}})</span>
                </div>
                <a href="#" class="angle"><i class="fa fa-angle-down" aria-hidden="true"></i></a>
                <div class='top-content-panel-icons'>
                    <a href="#" class="popular" ng-click="vm.sortBy('rate')">
                        <svg width="18px" height="20px">
                            <g id="Design-flow" stroke="none" stroke-width="1" fill="#1E2022" fill-rule="evenodd">
                                <g id="Home-page---interactions" transform="translate(-1192.000000, -91.000000)"
                                   fill="#EDF2F5">
                                    <path d="M1209.06464,100.288261 C1210.19396,103.219118 1211.76442,109.788579 1203.8724,111 C1203.78012,110.999305 1203.69244,110.960195 1203.63108,110.892348 C1203.56971,110.824502 1203.54039,110.734259 1203.55037,110.643955 C1203.8045,108.455928 1202.98552,106.279466 1201.34466,104.782242 C1201.14763,104.599723 1200.84029,104.599723 1200.64325,104.782242 C1199.00905,106.274709 1198.19067,108.441495 1198.43754,110.622245 C1198.4469,110.716503 1198.41353,110.810023 1198.34634,110.877822 C1198.27916,110.945622 1198.18501,110.980796 1198.08904,110.973948 C1196.69504,110.856714 1192.47331,110.144624 1192.02776,105.893796 C1191.86297,104.061178 1192.4365,102.23822 1193.62469,100.817987 C1195.30544,98.7511897 1198.18609,94.7391725 1197.98758,91.6997655 C1197.97963,91.4634544 1198.09745,91.2401662 1198.29843,91.1106548 C1198.49941,90.9811434 1198.75445,90.9641544 1198.97132,91.065832 C1201.17703,92.2555428 1205.7649,95.2688977 1204.94879,102.563475 C1206.10285,102.014299 1207.09462,101.18313 1207.82944,100.149317 C1207.95717,99.9607941 1208.17271,99.8481918 1208.40292,99.8497183 C1208.69547,99.8436398 1208.96033,100.019175 1209.06464,100.288261 Z"
                                          id="Path"></path>
                                </g>
                            </g>
                        </svg>
                    </a>
                    <a href="#" class="recent active-top-content-panel-icon" ng-click="vm.sortBy('date')">
                        <svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1"
                             xmlns="http://www.w3.org/2000/svg">
                            <g id="Design-flow" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g id="Home-page---interactions" transform="translate(-1240.000000, -91.000000)"
                                   fill="#EDF2F5">
                                    <path d="M1250,91 C1244.47222,91 1240,95.4722222 1240,101 C1240,106.527778 1244.47222,111 1250,111 C1255.52778,111 1260,106.527778 1260,101 C1260,95.4722222 1255.52778,91 1250,91 Z M1254.16667,102.833333 L1249.16667,102.833333 C1248.86111,102.833333 1248.61111,102.583333 1248.61111,102.277778 L1248.61111,96.3888889 C1248.61111,96.0833333 1248.86111,95.8333333 1249.16667,95.8333333 C1249.47222,95.8333333 1249.72222,96.0833333 1249.72222,96.3888889 L1249.72222,101.694444 L1254.16667,101.694444 C1254.47222,101.694444 1254.72222,101.944444 1254.72222,102.25 C1254.72222,102.555556 1254.47222,102.833333 1254.16667,102.833333 Z"
                                          id="Shape"></path>
                                </g>
                            </g>
                        </svg>
                    </a>
                </div>
            </div>


            <div class="spinner " ng-hide="!vm.loading">
                <div class="double-bounce1"></div>
                <div class="double-bounce2"></div>
            </div>
            <section class="content-section lazy" id="content-section" ng-class="{'loading': vm.loading}">
                <div
                        ng-repeat="p in vm.posts" ng-click="vm.openPost(p, $index)"
                        ng-style="{ background: ' url({{ vm.getTitleImage(p)}}) 50% 50%/150% no-repeat' }">
                    <div class="content-description clearfix">
                        <p class="title1">{{p.title}}</p>
                        <p class="date">{{vm.convertDate(p.date) | date}}</p>
                        <a class="like clearfix" ng-class="{ 'liked': vm.liked(p.content) }"
                           ng-click="vm.like(p, vm.liked(p.content), $event); $event.stopPropagation();">
                            <svg width="14px" height="13px" viewBox="0 0 14 13" version="1.1"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g id="Design-flow" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <g id="Home-page---interactions" transform="translate(-604.000000, -649.000000)"
                                       fill="#7E8E99">
                                        <g id="card-on-hover" transform="translate(234.000000, 433.000000)">
                                            <g id="Loyce-Copy" transform="translate(370.000000, 215.000000)">
                                                <path d="M12.7970258,2.23468863 C11.2005603,0.616568872 8.61394569,0.609511529 7.00890439,2.21889627 L7.00890439,2.21889627 C5.40582487,0.59400966 2.80637056,0.593656136 1.20286068,2.21810665 C-0.400649201,3.84255716 -0.400998074,6.47666535 1.20208145,8.10155195 L6.99955363,14 L7.01513823,13.9842076 L7.01513823,13.9842076 L12.8126104,8.10155195 L12.8126104,8.10155195 C14.4018569,6.47492822 14.3948911,3.85261896 12.7970258,2.23468863 Z"
                                                      id="Shape"></path>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>

                            <span>{{vm.likes(p.content)}}</span></a>
                    </div>
                </div>

                <p id="category-description">
                    {{vm.selectedCategory.description}}
                </p>
            </section>
        </div>
    </main>

    <div id="myModal" class="modal">

        <!-- Modal content -->
        <div class="modal-content">
            <span class="left-arrow" ng-click="vm.previousPost()"></span>
            <span class="right-arrow" ng-click="vm.nextPost()"></span>

            <div class="all-white"></div>

            <div class="modal-header">
                <div class="header-content">
                    <span class="close" ng-click="vm.closePost()"></span>
                    <span class="title">{{vm.selectedPost.title}}</span>
                    <span class="date">{{vm.convertDate(vm.selectedPost.date) | date}}</span>
                    <a class="like rate" ng-class="{ 'liked': vm.liked(vm.selectedPost.content) }"
                       ng-click="vm.like(vm.selectedPost, vm.liked(vm.selectedPost.content), $event)">
                        <svg width="14px" height="13px" viewBox="0 0 14 13" version="1.1"
                             xmlns="http://www.w3.org/2000/svg">
                            <g id="Design-flow" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g id="Home-page---interactions" transform="translate(-604.000000, -649.000000)"
                                   fill="#7E8E99">
                                    <g id="card-on-hover" transform="translate(234.000000, 433.000000)">
                                        <g id="Loyce-Copy" transform="translate(370.000000, 215.000000)">
                                            <path d="M12.7970258,2.23468863 C11.2005603,0.616568872 8.61394569,0.609511529 7.00890439,2.21889627 L7.00890439,2.21889627 C5.40582487,0.59400966 2.80637056,0.593656136 1.20286068,2.21810665 C-0.400649201,3.84255716 -0.400998074,6.47666535 1.20208145,8.10155195 L6.99955363,14 L7.01513823,13.9842076 L7.01513823,13.9842076 L12.8126104,8.10155195 L12.8126104,8.10155195 C14.4018569,6.47492822 14.3948911,3.85261896 12.7970258,2.23468863 Z"
                                                  id="Shape"></path>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>

                        <span>
                            {{vm.likes(vm.selectedPost.content)}}
                        </span>
                    </a>

                    <a class="download" href="{{vm.getImage('desktop')}}" target="_blank" download></a>
                    <a href="{{vm.getUrl('website')}}" class="visit" target="_blank" rel="nofollow">visit website</a>
                </div>
                <div class="icons">
                    <span class="mobile" ng-click="vm.loadMobile()" ng-class="{ 'disabled': vm.getImage('mobile') == null }"></span>
                    <span class="play" ng-click="vm.loadVideo()" ng-class="{ 'disabled': vm.getUrl('video') == null }"></span>
                </div>
            </div>
            <div class="modal-body" id="modal-content">
                <img class="screenshot" id="screenshot" ng-src="{{vm.getImage('desktop')}}" alt="nothing">
                <div id="video"></div>
            </div>

        </div>

    </div>


    <?php wp_footer(); ?>

    <script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js"></script>
</body>
</html>