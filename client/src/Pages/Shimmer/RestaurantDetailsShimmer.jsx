export default function RestaurantDetailsShimmer() {
      return (
            <div className="container mx-auto px-4 py-8">
                  {/* Restaurant Details Section */}
                  <section className="mb-12">
                        <div className="grid md:grid-cols-2 gap-8 items-start">
                              {/* Image Shimmer */}
                              <div className="aspect-video rounded-lg bg-gray-200 animate-pulse" />

                              <div className="space-y-4">
                                    {/* Restaurant Name Shimmer */}
                                    <div className="h-8 w-3/4 rounded-md bg-gray-200 animate-pulse" />

                                    {/* Quick Description Shimmer */}
                                    <div className="h-4 w-full rounded-md bg-gray-200 animate-pulse" />

                                    {/* Address Shimmer */}
                                    <div className="flex items-center gap-2">
                                          <div className="h-4 w-4 rounded-full bg-gray-200 animate-pulse" />
                                          <div className="h-4 w-2/3 rounded-md bg-gray-200 animate-pulse" />
                                    </div>

                                    {/* Cuisines Shimmer */}
                                    <div className="flex flex-wrap gap-2">
                                          {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-6 w-20 rounded-full bg-gray-200 animate-pulse" />
                                          ))}
                                    </div>

                                    {/* Rating Shimmer */}
                                    <div className="flex items-center gap-4">
                                          <div className="h-6 w-16 rounded-md bg-gray-200 animate-pulse" />
                                          <div className="h-4 w-24 rounded-md bg-gray-200 animate-pulse" />
                                    </div>

                                    {/* Contact Info Shimmer */}
                                    <div className="space-y-2">
                                          {[1, 2].map((i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                      <div className="h-4 w-4 rounded-full bg-gray-200 animate-pulse" />
                                                      <div className="h-4 w-32 rounded-md bg-gray-200 animate-pulse" />
                                                </div>
                                          ))}
                                    </div>
                              </div>
                        </div>

                        {/* About Section Shimmer */}
                        <div className="my-8 h-px bg-gray-300" />
                        <div className="space-y-4">
                              <div className="h-6 w-32 rounded-md bg-gray-200 animate-pulse" />
                              <div className="h-24 w-full rounded-md bg-gray-200 animate-pulse" />
                        </div>
                  </section>

                  {/* Menu Section */}
                  <section>
                        <div className="h-6 w-32 mb-6 rounded-md bg-gray-200 animate-pulse" />

                        {/* Search and Filter Shimmer */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                              <div className="h-10 w-full md:w-64 rounded-md bg-gray-200 animate-pulse" />
                              <div className="h-10 w-40 rounded-md bg-gray-200 animate-pulse" />
                              <div className="h-10 w-32 rounded-md bg-gray-200 animate-pulse" />
                        </div>

                        {/* Menu Items Grid Shimmer */}
                        <div className="grid  sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-6">
                              {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="overflow-hidden rounded-lg p-4 space-y-2">
                                          <div className="aspect-video w-full bg-gray-200 animate-pulse" />
                                          <div className="h-5 w-3/4 rounded-md bg-gray-200 animate-pulse" />
                                          <div className="h-4 w-1/2 rounded-md bg-gray-200 animate-pulse" />
                                          <div className="h-4 w-1/4 rounded-md bg-gray-200 animate-pulse" />
                                    </div>
                              ))}
                        </div>

                        {/* Menu Items Table Shimmer */}
                        <div className="mt-6 border rounded-lg p-4">
                              <div className="h-6 w-32 rounded-md bg-gray-200 animate-pulse mb-4" />
                              <div className="space-y-4">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                          <div key={i} className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
                                                <div className="h-4 flex-1 rounded-md bg-gray-200 animate-pulse" />
                                                <div className="h-4 w-20 rounded-md bg-gray-200 animate-pulse" />
                                                <div className="h-8 w-24 rounded-md bg-gray-200 animate-pulse" />
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </section>
            </div>
      );
}
