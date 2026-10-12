import type { Schema, Struct } from '@strapi/strapi';

export interface SharedActionCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_action_cards';
  info: {
    displayName: 'Action card';
    icon: 'file';
  };
  attributes: {
    label: Schema.Attribute.String;
    linkText: Schema.Attribute.String;
    linkUrl: Schema.Attribute.String;
  };
}

export interface SharedCollaborator extends Struct.ComponentSchema {
  collectionName: 'components_shared_collaborators';
  info: {
    displayName: 'Collaborator';
    icon: 'briefcase';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<['Aotearoa', 'International']> &
      Schema.Attribute.Required;
    url: Schema.Attribute.String;
  };
}

export interface SharedContributor extends Struct.ComponentSchema {
  collectionName: 'components_shared_contributors';
  info: {
    displayName: 'Contributor';
    icon: 'user';
  };
  attributes: {
    contributorType: Schema.Attribute.Enumeration<
      ['teamMember', 'nameAndUrl']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'teamMember'>;
    name: Schema.Attribute.String;
    role: Schema.Attribute.String & Schema.Attribute.Required;
    teamMember: Schema.Attribute.Relation<
      'manyToOne',
      'api::team-member.team-member'
    >;
    url: Schema.Attribute.String;
  };
}

export interface SharedExternalLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_external_links';
  info: {
    displayName: 'External link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFeature extends Struct.ComponentSchema {
  collectionName: 'components_shared_features';
  info: {
    displayName: 'Feature';
    icon: 'star';
  };
  attributes: {
    buttonText: Schema.Attribute.String;
    buttonURL: Schema.Attribute.String;
    description: Schema.Attribute.Blocks;
    title: Schema.Attribute.String;
  };
}

export interface SharedFooterLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_links';
  info: {
    displayName: 'Footer link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    location: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedGroupLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_group_links';
  info: {
    displayName: 'Group link';
    icon: 'link';
  };
  attributes: {
    description: Schema.Attribute.String;
    link: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedHero extends Struct.ComponentSchema {
  collectionName: 'components_shared_heroes';
  info: {
    displayName: 'Hero';
    icon: 'landscape';
  };
  attributes: {
    heroDescription: Schema.Attribute.Blocks & Schema.Attribute.Required;
    heroItems: Schema.Attribute.Component<'shared.hero-items', false> &
      Schema.Attribute.Required;
    heroTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'We help people tell stories with data'>;
  };
}

export interface SharedHeroItems extends Struct.ComponentSchema {
  collectionName: 'components_shared_hero_items';
  info: {
    displayName: 'Hero items';
    icon: 'apps';
  };
  attributes: {
    heroDataAnalysis: Schema.Attribute.Blocks & Schema.Attribute.Required;
    heroDataCollection: Schema.Attribute.Blocks & Schema.Attribute.Required;
    heroDataDesign: Schema.Attribute.Blocks & Schema.Attribute.Required;
    heroDataSovereignty: Schema.Attribute.Blocks & Schema.Attribute.Required;
    heroDataVisualisation: Schema.Attribute.Blocks & Schema.Attribute.Required;
    heroTraining: Schema.Attribute.Blocks & Schema.Attribute.Required;
  };
}

export interface SharedHomeApp extends Struct.ComponentSchema {
  collectionName: 'components_shared_home_apps';
  info: {
    displayName: 'Home app';
    icon: 'apps';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLandingTitle extends Struct.ComponentSchema {
  collectionName: 'components_shared_landing_titles';
  info: {
    displayName: 'Landing title';
    icon: 'quote';
  };
  attributes: {
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Analytics, research, and data visualisation that make a difference'>;
  };
}

export interface SharedLinkGroup extends Struct.ComponentSchema {
  collectionName: 'components_shared_link_groups';
  info: {
    displayName: 'Link group';
    icon: 'layer';
  };
  attributes: {
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    groupLinks: Schema.Attribute.Component<'shared.group-link', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    label: Schema.Attribute.String;
  };
}

export interface SharedMenuLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_menu_links';
  info: {
    displayName: 'Menu link';
    icon: 'bulletList';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    location: Schema.Attribute.String & Schema.Attribute.Required;
    submenu: Schema.Attribute.Component<'shared.submenu-link', true>;
    tereo: Schema.Attribute.String;
  };
}

export interface SharedMetadata extends Struct.ComponentSchema {
  collectionName: 'components_shared_metadata';
  info: {
    description: 'Fallback title, description, and social image.';
    displayName: 'Metadata';
    icon: 'search';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface SharedPersonName extends Struct.ComponentSchema {
  collectionName: 'components_shared_person_names';
  info: {
    displayName: 'Person name';
    icon: 'user';
  };
  attributes: {
    first: Schema.Attribute.String & Schema.Attribute.Required;
    last: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String;
  };
}

export interface SharedPillar extends Struct.ComponentSchema {
  collectionName: 'components_shared_pillars';
  info: {
    displayName: 'Pillar';
    icon: 'grid';
  };
  attributes: {
    description: Schema.Attribute.Blocks & Schema.Attribute.Required;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSocialAccount extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_accounts';
  info: {
    displayName: 'Social account';
    icon: 'link';
  };
  attributes: {
    name: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'Social link';
    icon: 'link';
  };
  attributes: {
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSubmenuLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_submenu_links';
  info: {
    displayName: 'Submenu link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    location: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTextSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_text_sections';
  info: {
    displayName: 'Text section';
    icon: 'feather';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    heading: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'shared.action-card': SharedActionCard;
      'shared.collaborator': SharedCollaborator;
      'shared.contributor': SharedContributor;
      'shared.external-link': SharedExternalLink;
      'shared.feature': SharedFeature;
      'shared.footer-link': SharedFooterLink;
      'shared.group-link': SharedGroupLink;
      'shared.hero': SharedHero;
      'shared.hero-items': SharedHeroItems;
      'shared.home-app': SharedHomeApp;
      'shared.landing-title': SharedLandingTitle;
      'shared.link-group': SharedLinkGroup;
      'shared.menu-link': SharedMenuLink;
      'shared.metadata': SharedMetadata;
      'shared.person-name': SharedPersonName;
      'shared.pillar': SharedPillar;
      'shared.social-account': SharedSocialAccount;
      'shared.social-link': SharedSocialLink;
      'shared.submenu-link': SharedSubmenuLink;
      'shared.text-section': SharedTextSection;
    }
  }
}
