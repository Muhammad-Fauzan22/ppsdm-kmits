/**
 * SEO Helper untuk PPSDM KMITS
 * Memudahkan penggunaan structured data dan meta tags
 */

import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateCourseSchema,
  generateFAQSchema,
  generatePersonSchema,
  generateEducationalOrganizationSchema,
  generateSoftwareApplicationSchema,
  generateVideoSchema,
  generateEventSchema,
  generateReviewSchema,
  generateAggregateRatingSchema,
  generateProductSchema,
  generateLocalBusinessSchema,
  generateHowToSchema,
  generateJobPostingSchema,
  generateServiceSchema,
  generateCollectionPageSchema,
  generateProfilePageSchema,
  generateSearchActionSchema,
  generateReadActionSchema,
  generateWatchActionSchema,
  generateListenActionSchema,
  generateInteractionCounterSchema,
  generateCommentSchema,
  generateDiscussionForumPostingSchema,
  generateQuestionSchema,
  generateAnswerSchema,
  generateListItemSchema,
  generateItemListSchema,
  generateImageObjectSchema,
  generateAudioObjectSchema,
  generateMediaObjectSchema,
  generateCreativeWorkSchema,
  generateBookSchema,
  generateMovieSchema,
  generateMusicRecordingSchema,
  generateTVSeriesSchema,
  generateEpisodeSchema,
  generateSeasonSchema,
  generateClipSchema,
  generatePodcastEpisodeSchema,
  generatePodcastSeriesSchema,
  generateDataFeedSchema,
  generateDataCatalogSchema,
  generateDatasetSchema,
  generateMenuSchema,
  generateMenuItemSchema,
  generateRecipeSchema,
  generateRestaurantSchema,
  generateLodgingBusinessSchema,
  generateTouristAttractionSchema,
  generatePlaceSchema,
  generateGeoCoordinatesSchema,
  generatePostalAddressSchema,
  generateOpeningHoursSpecificationSchema,
  generateOfferSchema,
  generateMonetaryAmountSchema,
  generatePriceSpecificationSchema,
  generateUnitPriceSpecificationSchema,
  generateDeliveryChargeSpecificationSchema,
  generatePaymentChargeSpecificationSchema,
  generateDeliveryMethodSchema,
  generatePaymentMethodSchema,
  generateOrderSchema,
  generateInvoiceSchema,
  generateReservationSchema,
  generateTicketSchema,
  generateSeatSchema,
  generateFlightSchema,
  generateBusTripSchema,
  generateTrainTripSchema,
  generateBusStopSchema,
  generateTrainStationSchema,
  generateAirportSchema,
  generateAirlineSchema,
  generateBusCompanySchema,
  generateTrainCompanySchema,
  generateCarSchema,
  generateVehicleSchema,
  generateBikeSchema,
  generateMotorcycleSchema,
  generateBusOrCoachSchema,
  generateEngineSpecificationSchema,
  generatePropertyValueSpecificationSchema,
  generatePropertyValueSchema,
  generateQuantitativeValueSchema,
  generateQuantitativeValueDistributionSchema,
  generateDateSchema,
  generateDateTimeSchema,
  generateTimeSchema,
  generateDurationSchema,
  generateDistanceSchema,
  generateEnergySchema,
  generateMassSchema,
  generateSpeedSchema,
  generateTemperatureSchema,
  generateVolumeSchema,
  generateActionSchema,
  generateCreateActionSchema,
  generateUpdateActionSchema,
  generateDeleteActionSchema,
  generateFindActionSchema,
  generatePlayActionSchema,
  generateViewActionSchema,
  generateListenActionSchema,
  generateMoveActionSchema,
  generateTransferActionSchema,
  generateBuyActionSchema,
  generateSellActionSchema,
  generateRentActionSchema,
  generateLendActionSchema,
  generateBorrowActionSchema,
  generateDonateActionSchema,
  generateGiveActionSchema,
  generateReceiveActionSchema,
  generateSendActionSchema,
  generateCommunicateActionSchema,
  generateInformActionSchema,
  generateInviteActionSchema,
  generateReplyActionSchema,
  generateShareActionSchema,
  generateSubscribeActionSchema,
  generateUnsubscribeActionSchema,
  generateFollowActionSchema,
  generateUnfollowActionSchema,
  generateLikeActionSchema,
  generateDislikeActionSchema,
  generateAgreeActionSchema,
  generateDisagreeActionSchema,
  generateRegisterActionSchema,
  generateLeaveActionSchema,
  generateJoinActionSchema,
  generatePartakeActionSchema,
  generateOrganizeActionSchema,
  generatePlanActionSchema,
  generateConfirmActionSchema,
  generateCancelActionSchema,
  generateApplyActionSchema,
  generateUseActionSchema,
  generateConsumeActionSchema,
  generateWearActionSchema,
  generateInstallActionSchema,
  generateUninstallActionSchema,
  generateUpdateActionSchema,
  generateUpgradeActionSchema,
  generateDowngradeActionSchema,
  generateRestoreActionSchema,
  generateBackupActionSchema,
  generateArchiveActionSchema,
  generateUnarchiveActionSchema,
  generateSuspendActionSchema,
  generateResumeActionSchema,
  generateApproveActionSchema,
  generateRejectActionSchema,
  generateAcceptActionSchema,
  generateDeclineActionSchema,
  generateCheckInActionSchema,
  generateCheckOutActionSchema,
  generateArriveActionSchema,
  generateDepartActionSchema,
  generateTrackActionSchema,
  generateAssignActionSchema,
  generateDeallocateActionSchema,
  generateAllocateActionSchema,
  generateControlActionSchema,
  generateManageActionSchema,
  generateMaintainActionSchema,
  generateRepairActionSchema,
  generateReplaceActionSchema,
  generateAssembleActionSchema,
  generateDisassembleActionSchema,
  generateConstructActionSchema,
  generateDestroyActionSchema,
  generateWriteActionSchema,
  generateReadActionSchema,
  generateTranslateActionSchema,
  generateTranscodeActionSchema,
  generateConvertActionSchema,
  generateCompressActionSchema,
  generateDecompressActionSchema,
  generateEncryptActionSchema,
  generateDecryptActionSchema,
  generateSignActionSchema,
  generateVerifyActionSchema,
  generateAuthenticateActionSchema,
} from './structuredData';

export interface MetaTags {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  siteName?: string;
  locale?: string;
  alternateLocale?: string[];
  canonical?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface OpenGraphTags {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  siteName?: string;
  locale?: string;
  alternateLocale?: string[];
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    expirationTime?: string;
    author?: string[];
    section?: string;
    tag?: string[];
  };
  product?: {
    price?: string;
    currency?: string;
    availability?: string;
    brand?: string;
    retailerItemId?: string;
  };
}

export interface TwitterCardTags {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
  player?: string;
  playerWidth?: number;
  playerHeight?: number;
  playerStream?: string;
  playerStreamContentType?: string;
  app?: {
    name?: {
      iphone?: string;
      ipad?: string;
      googleplay?: string;
    };
    id?: {
      iphone?: string;
      ipad?: string;
      googleplay?: string;
    };
    url?: {
      iphone?: string;
      ipad?: string;
      googleplay?: string;
    };
  };
}

/**
 * Generate meta tags for SEO
 */
export function generateMetaTags(meta: MetaTags): string[] {
  const tags: string[] = [];

  if (meta.title) {
    tags.push(`<title>${meta.title}</title>`);
    tags.push(`<meta name="title" content="${meta.title}" />`);
  }

  if (meta.description) {
    tags.push(`<meta name="description" content="${meta.description}" />`);
  }

  if (meta.keywords && meta.keywords.length > 0) {
    tags.push(`<meta name="keywords" content="${meta.keywords.join(', ')}" />`);
  }

  if (meta.author) {
    tags.push(`<meta name="author" content="${meta.author}" />`);
  }

  if (meta.image) {
    tags.push(`<meta name="image" content="${meta.image}" />`);
  }

  if (meta.url) {
    tags.push(`<meta name="url" content="${meta.url}" />`);
  }

  if (meta.type) {
    tags.push(`<meta name="type" content="${meta.type}" />`);
  }

  if (meta.siteName) {
    tags.push(`<meta name="site_name" content="${meta.siteName}" />`);
  }

  if (meta.locale) {
    tags.push(`<meta name="locale" content="${meta.locale}" />`);
  }

  if (meta.alternateLocale && meta.alternateLocale.length > 0) {
    meta.alternateLocale.forEach(locale => {
      tags.push(`<meta name="locale:alternate" content="${locale}" />`);
    });
  }

  if (meta.canonical) {
    tags.push(`<link rel="canonical" href="${meta.canonical}" />`);
  }

  if (meta.noIndex) {
    tags.push(`<meta name="robots" content="noindex" />`);
  }

  if (meta.noFollow) {
    tags.push(`<meta name="robots" content="nofollow" />`);
  }

  return tags;
}

/**
 * Generate Open Graph tags
 */
export function generateOpenGraphTags(og: OpenGraphTags): string[] {
  const tags: string[] = [];

  if (og.title) {
    tags.push(`<meta property="og:title" content="${og.title}" />`);
  }

  if (og.description) {
    tags.push(`<meta property="og:description" content="${og.description}" />`);
  }

  if (og.image) {
    tags.push(`<meta property="og:image" content="${og.image}" />`);
  }

  if (og.url) {
    tags.push(`<meta property="og:url" content="${og.url}" />`);
  }

  if (og.type) {
    tags.push(`<meta property="og:type" content="${og.type}" />`);
  }

  if (og.siteName) {
    tags.push(`<meta property="og:site_name" content="${og.siteName}" />`);
  }

  if (og.locale) {
    tags.push(`<meta property="og:locale" content="${og.locale}" />`);
  }

  if (og.alternateLocale && og.alternateLocale.length > 0) {
    og.alternateLocale.forEach(locale => {
      tags.push(`<meta property="og:locale:alternate" content="${locale}" />`);
    });
  }

  if (og.article) {
    if (og.article.publishedTime) {
      tags.push(`<meta property="article:published_time" content="${og.article.publishedTime}" />`);
    }
    if (og.article.modifiedTime) {
      tags.push(`<meta property="article:modified_time" content="${og.article.modifiedTime}" />`);
    }
    if (og.article.expirationTime) {
      tags.push(`<meta property="article:expiration_time" content="${og.article.expirationTime}" />`);
    }
    if (og.article.author && og.article.author.length > 0) {
      og.article.author.forEach(author => {
        tags.push(`<meta property="article:author" content="${author}" />`);
      });
    }
    if (og.article.section) {
      tags.push(`<meta property="article:section" content="${og.article.section}" />`);
    }
    if (og.article.tag && og.article.tag.length > 0) {
      og.article.tag.forEach(tag => {
        tags.push(`<meta property="article:tag" content="${tag}" />`);
      });
    }
  }

  if (og.product) {
    if (og.product.price) {
      tags.push(`<meta property="product:price:amount" content="${og.product.price}" />`);
    }
    if (og.product.currency) {
      tags.push(`<meta property="product:price:currency" content="${og.product.currency}" />`);
    }
    if (og.product.availability) {
      tags.push(`<meta property="product:availability" content="${og.product.availability}" />`);
    }
    if (og.product.brand) {
      tags.push(`<meta property="product:brand" content="${og.product.brand}" />`);
    }
    if (og.product.retailerItemId) {
      tags.push(`<meta property="product:retailer_item_id" content="${og.product.retailerItemId}" />`);
    }
  }

  return tags;
}

/**
 * Generate Twitter Card tags
 */
export function generateTwitterCardTags(twitter: TwitterCardTags): string[] {
  const tags: string[] = [];

  if (twitter.card) {
    tags.push(`<meta name="twitter:card" content="${twitter.card}" />`);
  }

  if (twitter.site) {
    tags.push(`<meta name="twitter:site" content="${twitter.site}" />`);
  }

  if (twitter.creator) {
    tags.push(`<meta name="twitter:creator" content="${twitter.creator}" />`);
  }

  if (twitter.title) {
    tags.push(`<meta name="twitter:title" content="${twitter.title}" />`);
  }

  if (twitter.description) {
    tags.push(`<meta name="twitter:description" content="${twitter.description}" />`);
  }

  if (twitter.image) {
    tags.push(`<meta name="twitter:image" content="${twitter.image}" />`);
  }

  if (twitter.player) {
    tags.push(`<meta name="twitter:player" content="${twitter.player}" />`);
  }

  if (twitter.playerWidth) {
    tags.push(`<meta name="twitter:player:width" content="${twitter.playerWidth}" />`);
  }

  if (twitter.playerHeight) {
    tags.push(`<meta name="twitter:player:height" content="${twitter.playerHeight}" />`);
  }

  if (twitter.playerStream) {
    tags.push(`<meta name="twitter:player:stream" content="${twitter.playerStream}" />`);
  }

  if (twitter.playerStreamContentType) {
    tags.push(`<meta name="twitter:player:stream:content_type" content="${twitter.playerStreamContentType}" />`);
  }

  if (twitter.app) {
    if (twitter.app.name) {
      if (twitter.app.name.iphone) {
        tags.push(`<meta name="twitter:app:name:iphone" content="${twitter.app.name.iphone}" />`);
      }
      if (twitter.app.name.ipad) {
        tags.push(`<meta name="twitter:app:name:ipad" content="${twitter.app.name.ipad}" />`);
      }
      if (twitter.app.name.googleplay) {
        tags.push(`<meta name="twitter:app:name:googleplay" content="${twitter.app.name.googleplay}" />`);
      }
    }
    if (twitter.app.id) {
      if (twitter.app.id.iphone) {
        tags.push(`<meta name="twitter:app:id:iphone" content="${twitter.app.id.iphone}" />`);
      }
      if (twitter.app.id.ipad) {
        tags.push(`<meta name="twitter:app:id:ipad" content="${twitter.app.id.ipad}" />`);
      }
      if (twitter.app.id.googleplay) {
        tags.push(`<meta name="twitter:app:id:googleplay" content="${twitter.app.id.googleplay}" />`);
      }
    }
    if (twitter.app.url) {
      if (twitter.app.url.iphone) {
        tags.push(`<meta name="twitter:app:url:iphone" content="${twitter.app.url.iphone}" />`);
      }
      if (twitter.app.url.ipad) {
        tags.push(`<meta name="twitter:app:url:ipad" content="${twitter.app.url.ipad}" />`);
      }
      if (twitter.app.url.googleplay) {
        tags.push(`<meta name="twitter:app:url:googleplay" content="${twitter.app.url.googleplay}" />`);
      }
    }
  }

  return tags;
}

/**
 * Generate JSON-LD structured data
 */
export function generateStructuredData(type: string, data: any): string {
  switch (type) {
    case 'Organization':
      return generateOrganizationSchema(data);
    case 'WebSite':
      return generateWebSiteSchema(data);
    case 'BreadcrumbList':
      return generateBreadcrumbSchema(data);
    case 'Article':
      return generateArticleSchema(data);
    case 'Course':
      return generateCourseSchema(data);
    case 'FAQPage':
      return generateFAQSchema(data);
    case 'Person':
      return generatePersonSchema(data);
    case 'EducationalOrganization':
      return generateEducationalOrganizationSchema(data);
    case 'SoftwareApplication':
      return generateSoftwareApplicationSchema(data);
    case 'VideoObject':
      return generateVideoSchema(data);
    case 'Event':
      return generateEventSchema(data);
    case 'Review':
      return generateReviewSchema(data);
    case 'AggregateRating':
      return generateAggregateRatingSchema(data);
    case 'Product':
      return generateProductSchema(data);
    case 'LocalBusiness':
      return generateLocalBusinessSchema(data);
    case 'HowTo':
      return generateHowToSchema(data);
    case 'JobPosting':
      return generateJobPostingSchema(data);
    case 'Service':
      return generateServiceSchema(data);
    case 'CollectionPage':
      return generateCollectionPageSchema(data);
    case 'ProfilePage':
      return generateProfilePageSchema(data);
    case 'SearchAction':
      return generateSearchActionSchema(data);
    case 'ReadAction':
      return generateReadActionSchema(data);
    case 'WatchAction':
      return generateWatchActionSchema(data);
    case 'ListenAction':
      return generateListenActionSchema(data);
    case 'InteractionCounter':
      return generateInteractionCounterSchema(data);
    case 'Comment':
      return generateCommentSchema(data);
    case 'DiscussionForumPosting':
      return generateDiscussionForumPostingSchema(data);
    case 'Question':
      return generateQuestionSchema(data);
    case 'Answer':
      return generateAnswerSchema(data);
    case 'ListItem':
      return generateListItemSchema(data);
    case 'ItemList':
      return generateItemListSchema(data);
    case 'ImageObject':
      return generateImageObjectSchema(data);
    case 'AudioObject':
      return generateAudioObjectSchema(data);
    case 'MediaObject':
      return generateMediaObjectSchema(data);
    case 'CreativeWork':
      return generateCreativeWorkSchema(data);
    case 'Book':
      return generateBookSchema(data);
    case 'Movie':
      return generateMovieSchema(data);
    case 'MusicRecording':
      return generateMusicRecordingSchema(data);
    case 'TVSeries':
      return generateTVSeriesSchema(data);
    case 'Episode':
      return generateEpisodeSchema(data);
    case 'Season':
      return generateSeasonSchema(data);
    case 'Clip':
      return generateClipSchema(data);
    case 'PodcastEpisode':
      return generatePodcastEpisodeSchema(data);
    case 'PodcastSeries':
      return generatePodcastSeriesSchema(data);
    case 'DataFeed':
      return generateDataFeedSchema(data);
    case 'DataCatalog':
      return generateDataCatalogSchema(data);
    case 'Dataset':
      return generateDatasetSchema(data);
    case 'Menu':
      return generateMenuSchema(data);
    case 'MenuItem':
      return generateMenuItemSchema(data);
    case 'Recipe':
      return generateRecipeSchema(data);
    case 'Restaurant':
      return generateRestaurantSchema(data);
    case 'LodgingBusiness':
      return generateLodgingBusinessSchema(data);
    case 'TouristAttraction':
      return generateTouristAttractionSchema(data);
    case 'Place':
      return generatePlaceSchema(data);
    case 'GeoCoordinates':
      return generateGeoCoordinatesSchema(data);
    case 'PostalAddress':
      return generatePostalAddressSchema(data);
    case 'OpeningHoursSpecification':
      return generateOpeningHoursSpecificationSchema(data);
    case 'Offer':
      return generateOfferSchema(data);
    case 'MonetaryAmount':
      return generateMonetaryAmountSchema(data);
    case 'PriceSpecification':
      return generatePriceSpecificationSchema(data);
    case 'UnitPriceSpecification':
      return generateUnitPriceSpecificationSchema(data);
    case 'DeliveryChargeSpecification':
      return generateDeliveryChargeSpecificationSchema(data);
    case 'PaymentChargeSpecification':
      return generatePaymentChargeSpecificationSchema(data);
    case 'DeliveryMethod':
      return generateDeliveryMethodSchema(data);
    case 'PaymentMethod':
      return generatePaymentMethodSchema(data);
    case 'Order':
      return generateOrderSchema(data);
    case 'Invoice':
      return generateInvoiceSchema(data);
    case 'Reservation':
      return generateReservationSchema(data);
    case 'Ticket':
      return generateTicketSchema(data);
    case 'Seat':
      return generateSeatSchema(data);
    case 'Flight':
      return generateFlightSchema(data);
    case 'BusTrip':
      return generateBusTripSchema(data);
    case 'TrainTrip':
      return generateTrainTripSchema(data);
    case 'BusStop':
      return generateBusStopSchema(data);
    case 'TrainStation':
      return generateTrainStationSchema(data);
    case 'Airport':
      return generateAirportSchema(data);
    case 'Airline':
      return generateAirlineSchema(data);
    case 'BusCompany':
      return generateBusCompanySchema(data);
    case 'TrainCompany':
      return generateTrainCompanySchema(data);
    case 'Car':
      return generateCarSchema(data);
    case 'Vehicle':
      return generateVehicleSchema(data);
    case 'Bike':
      return generateBikeSchema(data);
    case 'Motorcycle':
      return generateMotorcycleSchema(data);
    case 'BusOrCoach':
      return generateBusOrCoachSchema(data);
    case 'EngineSpecification':
      return generateEngineSpecificationSchema(data);
    case 'PropertyValueSpecification':
      return generatePropertyValueSpecificationSchema(data);
    case 'PropertyValue':
      return generatePropertyValueSchema(data);
    case 'QuantitativeValue':
      return generateQuantitativeValueSchema(data);
    case 'QuantitativeValueDistribution':
      return generateQuantitativeValueDistributionSchema(data);
    case 'Date':
      return generateDateSchema(data);
    case 'DateTime':
      return generateDateTimeSchema(data);
    case 'Time':
      return generateTimeSchema(data);
    case 'Duration':
      return generateDurationSchema(data);
    case 'Distance':
      return generateDistanceSchema(data);
    case 'Energy':
      return generateEnergySchema(data);
    case 'Mass':
      return generateMassSchema(data);
    case 'Speed':
      return generateSpeedSchema(data);
    case 'Temperature':
      return generateTemperatureSchema(data);
    case 'Volume':
      return generateVolumeSchema(data);
    case 'Action':
      return generateActionSchema(data);
    case 'CreateAction':
      return generateCreateActionSchema(data);
    case 'UpdateAction':
      return generateUpdateActionSchema(data);
    case 'DeleteAction':
      return generateDeleteActionSchema(data);
    case 'FindAction':
      return generateFindActionSchema(data);
    case 'PlayAction':
      return generatePlayActionSchema(data);
    case 'ViewAction':
      return generateViewActionSchema(data);
    case 'MoveAction':
      return generateMoveActionSchema(data);
    case 'TransferAction':
      return generateTransferActionSchema(data);
    case 'BuyAction':
      return generateBuyActionSchema(data);
    case 'SellAction':
      return generateSellActionSchema(data);
    case 'RentAction':
      return generateRentActionSchema(data);
    case 'LendAction':
      return generateLendActionSchema(data);
    case 'BorrowAction':
      return generateBorrowActionSchema(data);
    case 'DonateAction':
      return generateDonateActionSchema(data);
    case 'GiveAction':
      return generateGiveActionSchema(data);
    case 'ReceiveAction':
      return generateReceiveActionSchema(data);
    case 'SendAction':
      return generateSendActionSchema(data);
    case 'CommunicateAction':
      return generateCommunicateActionSchema(data);
    case 'InformAction':
      return generateInformActionSchema(data);
    case 'InviteAction':
      return generateInviteActionSchema(data);
    case 'ReplyAction':
      return generateReplyActionSchema(data);
    case 'ShareAction':
      return generateShareActionSchema(data);
    case 'SubscribeAction':
      return generateSubscribeActionSchema(data);
    case 'UnsubscribeAction':
      return generateUnsubscribeActionSchema(data);
    case 'FollowAction':
      return generateFollowActionSchema(data);
    case 'UnfollowAction':
      return generateUnfollowActionSchema(data);
    case 'LikeAction':
      return generateLikeActionSchema(data);
    case 'DislikeAction':
      return generateDislikeActionSchema(data);
    case 'AgreeAction':
      return generateAgreeActionSchema(data);
    case 'DisagreeAction':
      return generateDisagreeActionSchema(data);
    case 'RegisterAction':
      return generateRegisterActionSchema(data);
    case 'LeaveAction':
      return generateLeaveActionSchema(data);
    case 'JoinAction':
      return generateJoinActionSchema(data);
    case 'PartakeAction':
      return generatePartakeActionSchema(data);
    case 'OrganizeAction':
      return generateOrganizeActionSchema(data);
    case 'PlanAction':
      return generatePlanActionSchema(data);
    case 'ConfirmAction':
      return generateConfirmActionSchema(data);
    case 'CancelAction':
      return generateCancelActionSchema(data);
    case 'ApplyAction':
      return generateApplyActionSchema(data);
    case 'UseAction':
      return generateUseActionSchema(data);
    case 'ConsumeAction':
      return generateConsumeActionSchema(data);
    case 'WearAction':
      return generateWearActionSchema(data);
    case 'InstallAction':
      return generateInstallActionSchema(data);
    case 'UninstallAction':
      return generateUninstallActionSchema(data);
    case 'UpgradeAction':
      return generateUpgradeActionSchema(data);
    case 'DowngradeAction':
      return generateDowngradeActionSchema(data);
    case 'RestoreAction':
      return generateRestoreActionSchema(data);
    case 'BackupAction':
      return generateBackupActionSchema(data);
    case 'ArchiveAction':
      return generateArchiveActionSchema(data);
    case 'UnarchiveAction':
      return generateUnarchiveActionSchema(data);
    case 'SuspendAction':
      return generateSuspendActionSchema(data);
    case 'ResumeAction':
      return generateResumeActionSchema(data);
    case 'ApproveAction':
      return generateApproveActionSchema(data);
    case 'RejectAction':
      return generateRejectActionSchema(data);
    case 'AcceptAction':
      return generateAcceptActionSchema(data);
    case 'DeclineAction':
      return generateDeclineActionSchema(data);
    case 'CheckInAction':
      return generateCheckInActionSchema(data);
    case 'CheckOutAction':
      return generateCheckOutActionSchema(data);
    case 'ArriveAction':
      return generateArriveActionSchema(data);
    case 'DepartAction':
      return generateDepartActionSchema(data);
    case 'TrackAction':
      return generateTrackActionSchema(data);
    case 'AssignAction':
      return generateAssignActionSchema(data);
    case 'DeallocateAction':
      return generateDeallocateActionSchema(data);
    case 'AllocateAction':
      return generateAllocateActionSchema(data);
    case 'ControlAction':
      return generateControlActionSchema(data);
    case 'ManageAction':
      return generateManageActionSchema(data);
    case 'MaintainAction':
      return generateMaintainActionSchema(data);
    case 'RepairAction':
      return generateRepairActionSchema(data);
    case 'ReplaceAction':
      return generateReplaceActionSchema(data);
    case 'AssembleAction':
      return generateAssembleActionSchema(data);
    case 'DisassembleAction':
      return generateDisassembleActionSchema(data);
    case 'ConstructAction':
      return generateConstructActionSchema(data);
    case 'DestroyAction':
      return generateDestroyActionSchema(data);
    case 'WriteAction':
      return generateWriteActionSchema(data);
    case 'TranslateAction':
      return generateTranslateActionSchema(data);
    case 'TranscodeAction':
      return generateTranscodeActionSchema(data);
    case 'ConvertAction':
      return generateConvertActionSchema(data);
    case 'CompressAction':
      return generateCompressActionSchema(data);
    case 'DecompressAction':
      return generateDecompressActionSchema(data);
    case 'EncryptAction':
      return generateEncryptActionSchema(data);
    case 'DecryptAction':
      return generateDecryptActionSchema(data);
    case 'SignAction':
      return generateSignActionSchema(data);
    case 'VerifyAction':
      return generateVerifyActionSchema(data);
    case 'AuthenticateAction':
      return generateAuthenticateActionSchema(data);
    default:
      return '';
  }
}

/**
 * Generate complete SEO head tags
 */
export function generateSEOHead(options: {
  meta?: MetaTags;
  openGraph?: OpenGraphTags;
  twitter?: TwitterCardTags;
  structuredData?: Array<{ type: string; data: any }>;
}): string {
  const tags: string[] = [];

  // Meta tags
  if (options.meta) {
    tags.push(...generateMetaTags(options.meta));
  }

  // Open Graph tags
  if (options.openGraph) {
    tags.push(...generateOpenGraphTags(options.openGraph));
  }

  // Twitter Card tags
  if (options.twitter) {
    tags.push(...generateTwitterCardTags(options.twitter));
  }

  // Structured data
  if (options.structuredData && options.structuredData.length > 0) {
    options.structuredData.forEach(item => {
      const jsonLd = generateStructuredData(item.type, item.data);
      if (jsonLd) {
        tags.push(`<script type="application/ld+json">${jsonLd}</script>`);
      }
    });
  }

  return tags.join('\n');
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(baseUrl: string, path: string): string {
  return `${baseUrl}${path}`;
}

/**
 * Generate hreflang tags
 */
export function generateHreflangTags(locales: Array<{ lang: string; url: string }>): string[] {
  const tags: string[] = [];

  locales.forEach(locale => {
    tags.push(`<link rel="alternate" hreflang="${locale.lang}" href="${locale.url}" />`);
  });

  return tags;
}

/**
 * Generate alternate language links
 */
export function generateAlternateLanguageLinks(
  baseUrl: string,
  path: string,
  locales: string[]
): string[] {
  const tags: string[] = [];

  locales.forEach(locale => {
    const url = `${baseUrl}/${locale}${path}`;
    tags.push(`<link rel="alternate" hreflang="${locale}" href="${url}" />`);
  });

  return tags;
}

/**
 * Generate robots meta tag
 */
export function generateRobotsMeta(options: {
  index?: boolean;
  follow?: boolean;
  noIndex?: boolean;
  noFollow?: boolean;
  noArchive?: boolean;
  noSnippet?: boolean;
  noImageIndex?: boolean;
  noTranslate?: boolean;
  maxSnippet?: number;
  maxImagePreview?: 'none' | 'standard' | 'large';
  maxVideoPreview?: number;
}): string {
  const directives: string[] = [];

  if (options.index) directives.push('index');
  if (options.follow) directives.push('follow');
  if (options.noIndex) directives.push('noindex');
  if (options.noFollow) directives.push('nofollow');
  if (options.noArchive) directives.push('noarchive');
  if (options.noSnippet) directives.push('nosnippet');
  if (options.noImageIndex) directives.push('noimageindex');
  if (options.noTranslate) directives.push('notranslate');
  if (options.maxSnippet) directives.push(`max-snippet:${options.maxSnippet}`);
  if (options.maxImagePreview) directives.push(`max-image-preview:${options.maxImagePreview}`);
  if (options.maxVideoPreview) directives.push(`max-video-preview:${options.maxVideoPreview}`);

  return `<meta name="robots" content="${directives.join(', ')}" />`;
}

/**
 * Generate viewport meta tag
 */
export function generateViewportMeta(options: {
  width?: number | 'device-width';
  height?: number | 'device-height';
  initialScale?: number;
  minimumScale?: number;
  maximumScale?: number;
  userScalable?: boolean;
}): string {
  const directives: string[] = [];

  if (options.width) directives.push(`width=${options.width}`);
  if (options.height) directives.push(`height=${options.height}`);
  if (options.initialScale) directives.push(`initial-scale=${options.initialScale}`);
  if (options.minimumScale) directives.push(`minimum-scale=${options.minimumScale}`);
  if (options.maximumScale) directives.push(`maximum-scale=${options.maximumScale}`);
  if (options.userScalable !== undefined) directives.push(`user-scalable=${options.userScalable ? 'yes' : 'no'}`);

  return `<meta name="viewport" content="${directives.join(', ')}" />`;
}

/**
 * Generate theme color meta tag
 */
export function generateThemeColorMeta(color: string): string {
  return `<meta name="theme-color" content="${color}" />`;
}

/**
 * Generate apple touch icon link
 */
export function generateAppleTouchIconLink(href: string, sizes?: string): string {
  if (sizes) {
    return `<link rel="apple-touch-icon" sizes="${sizes}" href="${href}" />`;
  }
  return `<link rel="apple-touch-icon" href="${href}" />`;
}

/**
 * Generate favicon link
 */
export function generateFaviconLink(href: string, type?: string, sizes?: string): string {
  let tag = `<link rel="icon" href="${href}"`;
  if (type) tag += ` type="${type}"`;
  if (sizes) tag += ` sizes="${sizes}"`;
  tag += ' />';
  return tag;
}

/**
 * Generate manifest link
 */
export function generateManifestLink(href: string): string {
  return `<link rel="manifest" href="${href}" />`;
}

/**
 * Generate preload link
 */
export function generatePreloadLink(href: string, as: string, type?: string, crossorigin?: string): string {
  let tag = `<link rel="preload" href="${href}" as="${as}"`;
  if (type) tag += ` type="${type}"`;
  if (crossorigin) tag += ` crossorigin="${crossorigin}"`;
  tag += ' />';
  return tag;
}

/**
 * Generate preconnect link
 */
export function generatePreconnectLink(href: string, crossorigin?: string): string {
  let tag = `<link rel="preconnect" href="${href}"`;
  if (crossorigin) tag += ` crossorigin="${crossorigin}"`;
  tag += ' />';
  return tag;
}

/**
 * Generate DNS prefetch link
 */
export function generateDnsPrefetchLink(href: string): string {
  return `<link rel="dns-prefetch" href="${href}" />`;
}

/**
 * Generate complete head tags
 */
export function generateCompleteHead(options: {
  meta?: MetaTags;
  openGraph?: OpenGraphTags;
  twitter?: TwitterCardTags;
  structuredData?: Array<{ type: string; data: any }>;
  robots?: {
    index?: boolean;
    follow?: boolean;
    noIndex?: boolean;
    noFollow?: boolean;
    noArchive?: boolean;
    noSnippet?: boolean;
    noImageIndex?: boolean;
    noTranslate?: boolean;
    maxSnippet?: number;
    maxImagePreview?: 'none' | 'standard' | 'large';
    maxVideoPreview?: number;
  };
  viewport?: {
    width?: number | 'device-width';
    height?: number | 'device-height';
    initialScale?: number;
    minimumScale?: number;
    maximumScale?: number;
    userScalable?: boolean;
  };
  themeColor?: string;
  appleTouchIcon?: { href: string; sizes?: string };
  favicon?: { href: string; type?: string; sizes?: string };
  manifest?: string;
  preloads?: Array<{ href: string; as: string; type?: string; crossorigin?: string }>;
  preconnects?: Array<{ href: string; crossorigin?: string }>;
  dnsPrefetches?: string[];
  canonical?: string;
  hreflangs?: Array<{ lang: string; url: string }>;
}): string {
  const tags: string[] = [];

  // Meta tags
  if (options.meta) {
    tags.push(...generateMetaTags(options.meta));
  }

  // Open Graph tags
  if (options.openGraph) {
    tags.push(...generateOpenGraphTags(options.openGraph));
  }

  // Twitter Card tags
  if (options.twitter) {
    tags.push(...generateTwitterCardTags(options.twitter));
  }

  // Structured data
  if (options.structuredData && options.structuredData.length > 0) {
    options.structuredData.forEach(item => {
      const jsonLd = generateStructuredData(item.type, item.data);
      if (jsonLd) {
        tags.push(`<script type="application/ld+json">${jsonLd}</script>`);
      }
    });
  }

  // Robots meta tag
  if (options.robots) {
    tags.push(generateRobotsMeta(options.robots));
  }

  // Viewport meta tag
  if (options.viewport) {
    tags.push(generateViewportMeta(options.viewport));
  }

  // Theme color meta tag
  if (options.themeColor) {
    tags.push(generateThemeColorMeta(options.themeColor));
  }

  // Apple touch icon link
  if (options.appleTouchIcon) {
    tags.push(generateAppleTouchIconLink(options.appleTouchIcon.href, options.appleTouchIcon.sizes));
  }

  // Favicon link
  if (options.favicon) {
    tags.push(generateFaviconLink(options.favicon.href, options.favicon.type, options.favicon.sizes));
  }

  // Manifest link
  if (options.manifest) {
    tags.push(generateManifestLink(options.manifest));
  }

  // Preload links
  if (options.preloads && options.preloads.length > 0) {
    options.preloads.forEach(preload => {
      tags.push(generatePreloadLink(preload.href, preload.as, preload.type, preload.crossorigin));
    });
  }

  // Preconnect links
  if (options.preconnects && options.preconnects.length > 0) {
    options.preconnects.forEach(preconnect => {
      tags.push(generatePreconnectLink(preconnect.href, preconnect.crossorigin));
    });
  }

  // DNS prefetch links
  if (options.dnsPrefetches && options.dnsPrefetches.length > 0) {
    options.dnsPrefetches.forEach(href => {
      tags.push(generateDnsPrefetchLink(href));
    });
  }

  // Canonical link
  if (options.canonical) {
    tags.push(`<link rel="canonical" href="${options.canonical}" />`);
  }

  // Hreflang links
  if (options.hreflangs && options.hreflangs.length > 0) {
    tags.push(...generateHreflangTags(options.hreflangs));
  }

  return tags.join('\n');
}

/**
 * Default SEO configuration for PPSDM KMITS
 */
export const defaultSEOConfig = {
  meta: {
    title: 'PPSDM KMITS - Platform Pengembangan SDM Mahasiswa ITS',
    description: 'Platform pengembangan soft skills dan hard skills mahasiswa ITS melalui assessment, course, dan mentoring.',
    keywords: ['PPSDM', 'KMITS', 'ITS', 'pengembangan SDM', 'soft skills', 'hard skills', 'assessment', 'course', 'mentoring'],
    siteName: 'PPSDM KMITS',
    locale: 'id_ID',
    type: 'website',
  },
  openGraph: {
    title: 'PPSDM KMITS - Platform Pengembangan SDM Mahasiswa ITS',
    description: 'Platform pengembangan soft skills dan hard skills mahasiswa ITS melalui assessment, course, dan mentoring.',
    type: 'website',
    siteName: 'PPSDM KMITS',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PPSDM KMITS - Platform Pengembangan SDM Mahasiswa ITS',
    description: 'Platform pengembangan soft skills dan hard skills mahasiswa ITS melalui assessment, course, dan mentoring.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: '#1e40af',
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Generate default SEO head for PPSDM KMITS
 */
export function generateDefaultSEOHead(url: string): string {
  return generateCompleteHead({
    ...defaultSEOConfig,
    meta: {
      ...defaultSEOConfig.meta,
      url,
    },
    openGraph: {
      ...defaultSEOConfig.openGraph,
      url,
    },
    canonical: url,
  });
}
