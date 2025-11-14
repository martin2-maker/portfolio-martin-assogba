import React from 'react';

const LegalPageLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-[#121926] text-white min-h-screen py-16">
    <div className="container mx-auto px-6 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-[#FF570A]">{title}</h1>
      <div className="prose prose-invert max-w-none space-y-4 text-gray-300">
        {children}
      </div>
    </div>
  </div>
);

export const PrivacyPolicyPage = () => (
  <LegalPageLayout title="Politique de confidentialité">
    <p>Dernière mise à jour : 03 Octobre 2025</p>
    <p>La présente Politique de confidentialité (ci-après la « Politique ») a pour objectif d’informer les utilisateurs du site internet www.martinos.com (le « Site »), exploité par Martin Assogba, sur la manière dont je collecte, utilise, protège et partage les données à caractère personnel, conformément au Règlement Général sur la Protection des Données (RGPD – UE 2016/679), à la loi n°2009-09 du 22 mai 2009 relative à la protection des données à caractère personnel en République du Bénin et aux autres lois applicables en matière de protection des données.</p>
    <p>En utilisant le Site et mes services, vous acceptez la présente Politique. Si vous n’acceptez pas ces termes, je vous invite à cesser l’utilisation du site.</p>
    
    <h2>Article 1 – Données personnelles collectées</h2>
    <h3>1.1. Principe de minimisation</h3>
    <p>Je m’engage à ne collecter que les données strictement nécessaires à la fourniture et à l’amélioration de mes services.</p>
    
    <h3>1.2. Situations de collecte</h3>
    <p>Les données personnelles peuvent être collectées dans les situations suivantes :</p>
    <ul>
      <li><strong>Navigation sur le site :</strong> adresses IP, données techniques du navigateur, logs de connexion, cookies et autres traceurs.</li>
      <li><strong>Formulaire de contact ou inscription à la newsletter :</strong> nom, prénom, adresse email, message envoyé volontairement.</li>
      <li><strong>Commandes de services ou devis :</strong> informations de facturation (adresse, pays, prestataires de paiement certifiés comme Stripe ou PayPal).</li>
      <li><strong>Utilisation des fonctionnalités du site :</strong> données saisies volontairement dans des outils ou formulaires.</li>
    </ul>

    <h3>1.3. Catégories de données collectées</h3>
    <ul>
      <li><strong>Données d’identification :</strong> nom, prénom, email.</li>
      <li><strong>Données professionnelles :</strong> société, secteur d’activité, informations utiles pour le projet.</li>
      <li><strong>Données financières :</strong> uniquement via prestataires agréés, je n’enregistre pas vos informations bancaires complètes.</li>
      <li><strong>Données techniques :</strong> IP, type de navigateur, système d’exploitation, logs serveur, préférences de langue, fuseau horaire.</li>
      <li><strong>Données d’utilisation :</strong> contenu soumis volontairement, fichiers, messages, projets, formulaires remplis.</li>
    </ul>

    <h3>1.4. Données sensibles</h3>
    <p>Aucune donnée sensible au sens de la loi béninoise et du RGPD (origine, convictions religieuses, santé, orientation sexuelle…) n’est collectée. Toute saisie volontaire est sous la responsabilité de l’utilisateur.</p>

    <h3>1.5. Caractère obligatoire ou facultatif</h3>
    <p>Certaines informations sont obligatoires pour accéder aux services (ex. email pour contact ou inscription). Les autres sont facultatives et servent uniquement à améliorer l’expérience utilisateur.</p>

    <h3>1.6. Sources des données</h3>
    <ul>
      <li>Directement auprès de l’utilisateur via formulaires, navigation ou utilisation des services.</li>
      <li>Via cookies et traceurs (ex. Google Analytics).</li>
      <li>Par l’intermédiaire de prestataires tiers (paiement sécurisé, emailing).</li>
    </ul>

    <h2>Article 2 – Pourquoi je collecte vos données</h2>
    <ul>
      <li><strong>Gestion de vos demandes :</strong> répondre à vos messages, demandes de devis ou projets.</li>
      <li><strong>Fourniture et amélioration des services :</strong> créer et suivre vos projets, optimiser mon site et mes outils.</li>
      <li><strong>Transactions et facturation :</strong> gérer les paiements via prestataires sécurisés.</li>
      <li><strong>Communication :</strong> vous informer de mises à jour, nouvelles offres ou actualités (avec votre consentement).</li>
      <li><strong>Sécurité :</strong> protéger le site et ses utilisateurs contre toute fraude ou usage abusif.</li>
    </ul>

    <h2>Article 3 – Sécurité et conservation</h2>
    <p>Je mets en place des mesures techniques et organisationnelles pour protéger vos données.</p>
    <p>Vos données sont conservées uniquement le temps nécessaire pour fournir mes services et respecter mes obligations légales.</p>
    <p>Une fois inutiles, elles sont supprimées de façon sécurisée.</p>

    <h2>Article 4 – Partage des données</h2>
    <p>Je ne vends jamais vos données.</p>
    <p>Elles peuvent être partagées avec des prestataires uniquement pour exécuter mes services (hébergement, paiement sécurisé, emailing).</p>
    <p>Les données peuvent être communiquées aux autorités si la loi l’exige.</p>
    <p>Aucun transfert hors UE sans protection équivalente des données.</p>

    <h2>Article 5 – Cookies et traceurs</h2>
    <p>Utilisés pour améliorer la navigation, mémoriser vos préférences et analyser l’usage du site.</p>
    <p>Vous pouvez accepter, refuser ou configurer les cookies via votre navigateur.</p>
    <p>Durée de conservation maximale : 13 mois.</p>

    <h2>Article 6 – Vos droits</h2>
    <p>Conformément au RGPD et à la loi béninoise sur la protection des données, vous pouvez :</p>
    <ul>
      <li>Accéder à vos données.</li>
      <li>Les rectifier si elles sont incorrectes.</li>
      <li>Demander leur suppression.</li>
      <li>Limiter ou vous opposer à leur traitement.</li>
      <li>Retirer votre consentement à tout moment (ex. newsletters).</li>
    </ul>
    <p>Pour exercer vos droits : contactez-moi par email à martinassogba75@gmail.com avec une pièce d’identité.</p>

    <h2>Article 7 – Modifications de la politique</h2>
    <p>Je peux mettre à jour cette politique pour suivre les évolutions légales ou techniques. La dernière mise à jour est indiquée en haut. En cas de changement important, vous serez informé via le site ou email.</p>

    <h2>Article 8 – Contact</h2>
    <p>Pour toute question sur vos données personnelles :</p>
    <p><strong>Email :</strong> martinassogba75@gmail.com</p>
    <p>Je m’engage à répondre rapidement et à vous fournir toutes les informations nécessaires sur l’utilisation de vos données.</p>
  </LegalPageLayout>
);

export const LegalNoticePage = () => (
  <LegalPageLayout title="Mentions Légales">
    <p>Date de dernière mise à jour : 07/11/2025</p>
    <h2>1. Éditeur du site</h2>
    <p>
      Nom de l’éditeur : Martin Assogba<br />
      Statut : Entrepreneur indépendant / Freelance<br />
      Activité : Création de sites web, landing pages, tunnels de vente et automatisations no-code<br />
      Pays : Bénin<br />
      Responsable de la publication : Martin Assogba<br />
      Email de contact : martinassogba75@gmail.com
    </p>

    <h2>3. Propriété intellectuelle</h2>
    <p>L’ensemble des éléments présents sur le site— textes, visuels, logos, vidéos, graphismes, code, structure et contenus — est la propriété exclusive de Martin Assogba, sauf mention contraire.</p>
    <p>Toute reproduction, diffusion, modification ou exploitation du contenu, totale ou partielle, sans autorisation écrite préalable est strictement interdite.</p>
    <p>L’utilisateur est autorisé à accéder et à utiliser le site dans le cadre de ses besoins professionnels ou personnels, conformément à son objet : la présentation des services, l’utilisation de nos outils, ainsi que la commande de prestations proposées par Martin Assogba.</p>
    <p>Toute utilisation abusive, détournée ou contraire aux lois en vigueur est strictly interdite.</p>

    <h2>4. Utilisation de l’intelligence artificielle</h2>
    <p>Certains contenus (textes, images, visuels, maquettes ou suggestions de design) présents sur ce site peuvent être créés ou optimisés à l’aide d’outils d’intelligence artificielle (IA).</p>
    <p>Martin Assogba supervise, corrige et valide chaque création avant sa publication afin de garantir leur qualité, leur cohérence et leur conformité légale.</p>
    <p>L’utilisation de ces outils n’altère pas la propriété intellectuelle du site, qui reste celle de Martin Assogba et/ou de ses clients conformément aux contrats établis.</p>

    <h2>5. Données personnelles</h2>
    <p>Le traitement des données personnelles collectées sur ce site est régi par la Politique de confidentialité, disponible sur le site.</p>
    <p>Conformément :</p>
    <ul>
      <li>à la loi n°2009-09 du 22 mai 2009 relative à la protection des données à caractère personnel en République du Bénin et aux recommandations de l’Autorité de Protection des Données Personnelles (APDP) ;</li>
      <li>au Règlement Général sur la Protection des Données (RGPD – UE 2016/679) pour les utilisateurs de l’Union Européenne ;</li>
      <li>et aux législations locales applicables pour les utilisateurs situés dans d’autres pays.</li>
    </ul>
    <p>Les données sont collectées dans le respect de la confidentialité et utilisées uniquement pour les finalités mentionnées (contact, facturation, suivi de projet, statistiques).</p>

    <h2>6. Cookies</h2>
    <p>Le site utilise des cookies et traceurs pour :</p>
    <ul>
      <li>améliorer la navigation et l’expérience utilisateur,</li>
      <li>mesurer l’audience et analyser les performances du site,</li>
      <li>mémoriser les préférences de navigation.</li>
    </ul>
    <p>Vous pouvez accepter, refuser ou configurer les cookies à tout moment via les paramètres de votre navigateur.</p>
    <p>La durée de conservation des cookies est limitée à 13 mois maximum.</p>

    <h2>7. Responsabilité</h2>
    <p>Martin Assogba met tout en œuvre pour assurer la fiabilité, l’exactitude et la mise à jour des informations publiées sur le site.</p>
    <p>Cependant, il ne saurait être tenu responsable :</p>
    <ul>
      <li>d’interruptions temporaires liées à la maintenance ou à des problèmes techniques ;</li>
      <li>de tout contenu externe accessible via des liens hypertextes ;</li>
      <li>d’éventuelles erreurs ou omissions dans les informations affichées.</li>
    </ul>
    <p>L’utilisation du site se fait sous la responsabilité exclusive de l’utilisateur.</p>

    <h2>8. Droit applicable et juridiction compétente</h2>
    <ul>
      <li>Utilisateurs résidant au Bénin : la loi n°2009-09 et les décisions de l’APDP s’appliquent. Les tribunaux compétents du siège social de l’éditeur sont seuls compétents en cas de litige.</li>
      <li>Utilisateurs résidant dans l’Union Européenne : le RGPD et les législations locales en vigueur s’appliquent.</li>
      <li>Utilisateurs situés dans le reste du monde : la législation locale du pays de résidence et celle du Bénin s’appliquent conjointement.</li>
    </ul>

    <h2>9. Contact</h2>
    <p>Pour toute question relative aux présentes mentions légales, vous pouvez me contacter :</p>
    <ul>
      <li>Par email : martinassogba75@gmail.com</li>
      <li>Via le formulaire de contact disponible sur le site</li>
    </ul>
  </LegalPageLayout>
);

export const TermsOfUsePage = () => (
  <LegalPageLayout title="Conditions Générales d’Utilisation">
    <p>Date de dernière mise à jour : 03/10/2025</p>
    <p>Les présentes Conditions Générales d’Utilisation (ci-après les « CGU ») régissent l’accès et l’utilisation de mon portfolio (ci-après le « Site »), exploité par Martin Assogba, freelance spécialisé dans la création de sites web, d’automatisations et d’applications no-code sur mesure.</p>
    <p>En accédant au Site et en utilisant ses services, vous acceptez sans réserve les présentes CGU. Si vous n’acceptez pas ces conditions, vous devez cesser toute utilisation du Site.</p>
    
    <h2>Article 1 – Description des services</h2>
    <h3>1.1. Objet</h3>
    <p>Le Site a pour objectif de présenter les prestations proposées par Martin Assogba, notamment la création de sites web, de landing pages, de tunnels de vente, d’applications no-code, d’intégrations API, ainsi que la mise à disposition d’outils interactifs permettant la création de projets, notes et factures à titre démonstratif ou professionnel.</p>
    <h3>1.2. Fonctionnalités</h3>
    <p>Le Site permet notamment :</p>
    <ul>
        <li>La consultation d’informations et de services proposés par le freelance ;</li>
        <li>L’utilisation d’outils interactifs (tâches, notes, ) ;</li>
        <li>La prise de contact via formulaire ou messagerie intégrée ;</li>
        <li>La commande de prestations ou demandes de devis personnalisés ;</li>
        <li>L’accès à un espace ou des ressources réservées à certains utilisateurs.</li>
    </ul>
    <h3>1.3. Évolution des services</h3>
    <p>Martin Assogba se réserve le droit de faire évoluer le contenu, les outils et les fonctionnalités du Site. Les présentes CGU couvrent l’ensemble des services actuels et futurs. Il est recommandé aux utilisateurs de consulter régulièrement cette page pour rester informés des modifications.</p>

    <h2>Article 2 – Droits et obligations de l’utilisateur</h2>
    <h3>2.1. Création et gestion de compte</h3>
    <p>Certaines fonctionnalités peuvent nécessiter la création d’un compte utilisateur. L’utilisateur est responsable de la confidentialité de ses identifiants et de toute activité réalisée sous son compte.</p>
    <h3>2.2. Obligations de l’utilisateur</h3>
    <p>L’utilisateur s’engage à :</p>
    <ul>
        <li>Fournir des informations exactes et à jour lors de la création ou de la modification de son compte ;</li>
        <li>Utiliser le Site uniquement dans le cadre de ses besoins professionnels ou personnels légitimes ;</li>
        <li>Ne pas détourner ou perturber le fonctionnement du Site (tentatives de piratage, intrusion, exploitation non autorisée) ;</li>
        <li>Respecter les droits de propriété intellectuelle liés au Site et à son contenu.</li>
    </ul>
    <h3>2.3. Responsabilité de l’utilisateur</h3>
    <p>Toute utilisation abusive, détournée ou contraire aux lois en vigueur engage la responsabilité de l’utilisateur. Martin Assogba se réserve le droit de suspendre ou supprimer un accès en cas d’usage frauduleux ou non conforme.</p>
    
    <h2>Article 3 – Propriété intellectuelle</h2>
    <h3>3.1. Droits sur le contenu du Site</h3>
    <p>L’ensemble des éléments présents sur le Site (textes, visuels, logos, vidéos, outils, maquettes, codes, graphiques, animations) sont protégés par le droit d’auteur et la propriété intellectuelle. Ils sont la propriété exclusive de Martin Assogba ou de ses partenaires.</p>
    <h3>3.2. Utilisation autorisée</h3>
    <p>L’utilisateur est autorisé à accéder et à utiliser le Site dans le cadre de ses besoins professionnels ou personnels, en lien avec les services proposés. Toute reproduction, modification, réutilisation ou exploitation commerciale du contenu sans autorisation écrite est strictement interdite.</p>
    <h3>3.3. Respect des créations</h3>
    <p>La conception, la structure et le design du projet livré demeurent la propriété intellectuelle de Martin Assogba. Le client dispose d’un droit d’usage non exclusif, personnel et illimité du livrable dans le cadre de son activité. Toute cession complète des droits fera l’objet d’un accord écrit spécifique.</p>
    <p><em><strong>Référence: Loi n° 2005-30 du 5 avril 2006 portant protection du droit d’auteur et des droits voisins.& Convention de Berne</strong></em></p>

    <h2>Article 4 – Responsabilité de l’éditeur</h2>
    <h3>4.1. Exactitude des informations</h3>
    <p>Martin Assogba s’efforce de garantir la fiabilité et l’actualisation des informations présentées sur le Site, sans toutefois pouvoir en garantir l’exactitude ou l’exhaustivité.</p>
    <h3>4.2. Disponibilité du Site</h3>
    <p>L’accès au Site peut être temporairement interrompu pour maintenance, mise à jour ou problème technique. Martin Assogba ne saurait être tenu responsable de ces interruptions ou de tout dommage résultant d’une indisponibilité temporaire.</p>
    <h3>4.3. Liens externes</h3>
    <p>Le Site peut contenir des liens vers d’autres sites web. Martin Assogba ne contrôle pas ces contenus externes et décline toute responsabilité quant à leur légalité, leur fiabilité ou leur actualisation.</p>
    <h3>4.4. Contenus générés par les utilisateurs</h3>
    <p>En cas d’outils collaboratifs ou d’espaces interactifs, les utilisateurs demeurent responsables des contenus qu’ils saisissent ou partagent.</p>
    
    <h2>Article 5 – Données personnelles</h2>
    <p>Les informations collectées sur le Site sont traitées conformément à la Politique de confidentialité disponible sur le Site. Elles respectent la loi n°2009-09 du 22 mai 2009 relative à la protection des données à caractère personnel au Bénin, ainsi que le Règlement Général sur la Protection des Données (RGPD – UE 2016/679) pour les utilisateurs européens.</p>

    <h2>Article 6 – Droit applicable et juridiction compétente</h2>
    <h3>6.1. Législation applicable</h3>
    <ul>
        <li>Pour les utilisateurs résidant au Bénin : application de la loi n°2009-09 du 22 mai 2009 et des décisions de l’Autorité de Protection des Données Personnelles (APDP) ;</li>
        <li>Pour les utilisateurs de l’Union Européenne : application du RGPD (UE 2016/679) et des lois locales ;</li>
        <li>Pour les utilisateurs du reste du monde : application des législations locales et internationales en vigueur.</li>
    </ul>
    <h3>6.2. Juridiction compétente</h3>
    <p>En cas de litige, les parties s’engagent à rechercher une solution amiable avant toute procédure judiciaire. À défaut d’accord :</p>
    <ul>
        <li>Pour les résidents du Bénin : les tribunaux compétents sont ceux du siège professionnel de Martin Assogba ;</li>
        <li>Pour les utilisateurs étrangers : la juridiction compétente sera déterminée selon la législation locale et les conventions internationales applicables.</li>
    </ul>
  </LegalPageLayout>
);
