const HeaderFooterModel = require('../../../models/headerFooterModel');
const { uploadSingleFile } = require('../../../utils/upload');

exports.getHeaderFooter = async () => {
  const headerFooter = await HeaderFooterModel.findOne({});
  return {
    success: true,
    message: 'Header and footer fetched successfully',
    data: headerFooter,
  };
};

exports.createHeaderFooter = async (
  logo,
  address,
  phone,
  email,
  facebook,
  instagram,
  twitter,
  linkedin,
  youtube
) => {
  let logoUrl = null;
  if (logo) {
    logoUrl = await uploadSingleFile(logo.path);
  }
  const headerFooter = await HeaderFooterModel.findOne({});
  if (headerFooter) {
    if (logoUrl) {
      headerFooter.logo = logoUrl;
    }
    headerFooter.address = address;
    headerFooter.phone = phone;
    headerFooter.email = email;
    headerFooter.facebook = facebook;
    headerFooter.instagram = instagram;
    headerFooter.twitter = twitter;
    headerFooter.linkedin = linkedin;
    headerFooter.youtube = youtube;
    await headerFooter.save();
    return {
      success: true,
      message: 'Header and footer updated successfully',
      data: headerFooter,
    };
  }
  const newHeaderFooter = await HeaderFooterModel.create({
    logo: logoUrl,
    address,
    phone,
    email,
    facebook,
    instagram,
    twitter,
    linkedin,
    youtube,
  });
  return {
    success: true,
    message: 'Header and footer created successfully',
    data: newHeaderFooter,
  };
};
