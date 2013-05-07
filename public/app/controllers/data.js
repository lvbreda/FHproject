/**
 * Created with JetBrains WebStorm.
 * User: landervanbreda
 * Date: 25/04/13
 * Time: 14:24
 * To change this template use File | Settings | File Templates.
 */
app.controller("DataCtrl", ['$scope', '$http', 'Endpoint', function ($scope, $http, Endpoint) {
    $scope.dataOptions = {

    }
    $scope.network = [
      {
        "name" : "Lander",
        "children"  : [
          {
            "name" : "Marc",
            "children"  : [
              {
                "name" : "Marc",
                "children"  : [
                  {
                    "name" : "Marc",
                    "children"  : [
                      {
                        "name" : "Marc"
                      },
                      {
                        "name" : "Sibet"
                      }
                    ]
                  },
                  {
                    "name" : "Sibet"
                  }
                ]
              },
              {
                "name" : "Sibet"
              }
            ]

          },
          {
            "name" : "Sibet"
          }
        ]
      },
      {
        "name" : "Karel",
        "children"  : [
          {
            "name" : "Marc",
            "children"  : [
              {
                "name" : "Marc",
                "children"  : [
                  {
                    "name" : "Marc",
                    "children"  : [
                      {
                        "name" : "Marc"
                      },
                      {
                        "name" : "Sibet"
                      }
                    ]
                  },
                  {
                    "name" : "Sibet"
                  }
                ]
              },
              {
                "name" : "Sibet"
              }
            ]

          },
          {
            "name" : "Sibet"
          }
        ]
      },
      {
        "name" : "Rainer",
        "children"  : [
          {
            "name" : "Marc",
            "children"  : [
              {
                "name" : "Marc",
                "children"  : [
                  {
                    "name" : "Marc",
                    "children"  : [
                      {
                        "name" : "Marc",
                        "children"  : [
                          {
                            "name" : "Marc",
                            "children"  : [
                              {
                                "name" : "Marc",
                                "children"  : [
                                  {
                                    "name" : "Marc",
                                    "children"  : [
                                      {
                                        "name" : "Marc"
                                      },
                                      {
                                        "name" : "Sibet",
                                        "children"  : [
                                          {
                                            "name" : "Marc",
                                            "children"  : [
                                              {
                                                "name" : "Marc",
                                                "children"  : [
                                                  {
                                                    "name" : "Marc",
                                                    "children"  : [
                                                      {
                                                        "name" : "Marc"
                                                      },
                                                      {
                                                        "name" : "Sibet"
                                                      }
                                                    ]
                                                  },
                                                  {
                                                    "name" : "Sibet"
                                                  }
                                                ]
                                              },
                                              {
                                                "name" : "Sibet"
                                              }
                                            ]

                                          },
                                          {
                                            "name" : "Sibet",
                                            "children"  : [
                                              {
                                                "name" : "Marc",
                                                "children"  : [
                                                  {
                                                    "name" : "Marc",
                                                    "children"  : [
                                                      {
                                                        "name" : "Marc",
                                                        "children"  : [
                                                          {
                                                            "name" : "Marc"
                                                          },
                                                          {
                                                            "name" : "Sibet"
                                                          }
                                                        ]
                                                      },
                                                      {
                                                        "name" : "Sibet"
                                                      }
                                                    ]
                                                  },
                                                  {
                                                    "name" : "Sibet"
                                                  }
                                                ]

                                              },
                                              {
                                                "name" : "Sibet"
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  },
                                  {
                                    "name" : "Sibet"
                                  }
                                ]
                              },
                              {
                                "name" : "Sibet"
                              }
                            ]

                          },
                          {
                            "name" : "Sibet"
                          }
                        ]
                      },
                      {
                        "name" : "Sibet",
                        "children"  : [
                          {
                            "name" : "Marc",
                            "children"  : [
                              {
                                "name" : "Marc",
                                "children"  : [
                                  {
                                    "name" : "Marc",
                                    "children"  : [
                                      {
                                        "name" : "Marc"
                                      },
                                      {
                                        "name" : "Sibet"
                                      }
                                    ]
                                  },
                                  {
                                    "name" : "Sibet"
                                  }
                                ]
                              },
                              {
                                "name" : "Sibet"
                              }
                            ]

                          },
                          {
                            "name" : "Sibet",
                            "children"  : [
                              {
                                "name" : "Marc",
                                "children"  : [
                                  {
                                    "name" : "Marc",
                                    "children"  : [
                                      {
                                        "name" : "Marc",
                                        "children"  : [
                                          {
                                            "name" : "Marc"
                                          },
                                          {
                                            "name" : "Sibet"
                                          }
                                        ]
                                      },
                                      {
                                        "name" : "Sibet"
                                      }
                                    ]
                                  },
                                  {
                                    "name" : "Sibet"
                                  }
                                ]

                              },
                              {
                                "name" : "Sibet"
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "name" : "Sibet"
                  }
                ]
              },
              {
                "name" : "Sibet"
              }
            ]

          },
          {
            "name" : "Sibet"
          }
        ]
      }
    ]
    $scope.links = [
      {
        "source" : 0,
        "target" : 2
      },
      {
        "source" : 1,
        "target" : 2
      },
      {
        "source" : 2,
        "target" : 0
      }
    ]
    $scope.data = [
      {
        "name" : "Lander",
        "surname" : "Van Breda",
        "title" : [
          {
            "naam" : "lander",
            "boom" : "eik"
          }, {
            "naam" : "lander",
            "boom" : [
              {
                "naam" : "lander",
                "boom" : "eik"
              }, {
                "naam" : "lander",
                "boom" : [
                  {
                    "naam" : "lander",
                    "boom" : "eik"
                  }, {
                    "naam" : "lander",
                    "boom" : {
                      "type" : "eik",
                      "size" : "50000m"
                    }
                  },
                  {
                    "naam" : "lander",
                    "boom" : {
                      "type" : "eik",
                      "size" : "50000m"
                    }
                  }
                ]
              },
              {
                "naam" : "lander",
                "boom" : {
                  "type" : "eik",
                  "size" : "50000m"
                }
              }
            ]
          },
          {
            "naam" : "lander",
            "boom" : {
              "type" : "eik",
              "size" : "50000m"
            }
          }
        ]
      },
      {
        "name" : "Lander",
        "surname" : "Van Breda",
        "title" : "CTO"
      }
    ]
    $scope.options = {
      "vertical" : false
    }
  //$scope.testers = Endpoint("Tester", true).get({name:"lander"});


}]);