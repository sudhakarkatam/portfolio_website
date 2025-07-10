-- Insert categories
INSERT INTO categories (name, name_te, slug, description, description_te, icon) VALUES
('Mobile Phones', 'మొబైల్ ఫోన్లు', 'mobile-phones', 'Latest smartphones and mobile devices', 'తాజా స్మార్ట్‌ఫోన్లు మరియు మొబైల్ పరికరాలు', '📱'),
('Home Appliances', 'గృహోపకరణలు', 'home-appliances', 'Essential home appliances for modern living', 'ఆధునిక జీవనానికి అవసరమైన గృహోపకరణలు', '🏠'),
('Kitchen Appliances', 'వంటగది ఉపకరణలు', 'kitchen-appliances', 'Kitchen gadgets and cooking appliances', 'వంటగది గాడ్జెట్లు మరియు వంట ఉపకరణలు', '🍳'),
('Electronics', 'ఎలక్ట్రానిక్స్', 'electronics', 'Consumer electronics and gadgets', 'వినియోగదారు ఎలక్ట్రానిక్స్ మరియు గాడ్జెట్లు', '💻'),
('Fashion', 'ఫ్యాషన్', 'fashion', 'Clothing, accessories and fashion items', 'దుస్తులు, ఉపకరణలు మరియు ఫ్యాషన్ వస్తువులు', '👕'),
('Books', 'పుస్తకాలు', 'books', 'Books, educational materials and literature', 'పుస్తకాలు, విద్యా సామగ్రి మరియు సాహిత్యం', '📚');

-- Insert sample products
INSERT INTO products (title, title_te, description, description_te, price, original_price, rating, category, category_te, brand, model, affiliate_link, youtube_video, images, pros, cons, specifications, content, content_te, featured) VALUES
('Bajaj Ceiling Fan 1200mm', 'బజాజ్ సీలింగ్ ఫ్యాన్ 1200mm', 'High-performance ceiling fan with energy efficiency', 'ఎనర్జీ ఎఫిషియెన్సీతో అధిక పనితీరు సీలింగ్ ఫ్యాన్', 1899.00, 2499.00, 4.5, 'Home Appliances', 'గృహోపకరణలు', 'Bajaj', 'BF-123', 'https://amazon.in/dp/example1', 'dQw4w9WgXcQ', 
ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400'], 
ARRAY['తక్కువ విద్యుత్ వినియోగం - Low power consumption', 'నిశ్శబ్ద ఆపరేషన్ - Silent operation'], 
ARRAY['రిమోట్ కంట్రోల్ లేదు - No remote control'], 
'{"Size": "1200mm", "Power": "75W", "Speed": "3 Speed", "Material": "Metal", "Warranty": "2 Years"}',
'<h2>Complete Review</h2><p>Excellent ceiling fan with great performance...</p>',
'<h2>పూర్తి రివ్యూ</h2><p>అద్భుతమైన పనితీరుతో అద్భుతమైన సీలింగ్ ఫ్యాన్...</p>', TRUE),

('Samsung Galaxy M34', 'సామ్సంగ్ గెలాక్సీ M34', 'Best budget smartphone with excellent features', 'అద్భుతమైన ఫీచర్లతో ఉత్తమ బడ్జెట్ స్మార్ట్‌ఫోన్', 16999.00, 19999.00, 4.3, 'Mobile Phones', 'మొబైల్ ఫోన్లు', 'Samsung', 'Galaxy M34', 'https://amazon.in/dp/example2', 'dQw4w9WgXcQ',
ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400'],
ARRAY['6000mAh బ్యాటరీ - 6000mAh Battery', '120Hz డిస్ప్లే - 120Hz Display'],
ARRAY['కెమెరా నైట్ మోడ్ మెరుగుపరచాలి - Camera night mode needs improvement'],
'{"Display": "6.5 inch", "Battery": "6000mAh", "Camera": "50MP", "Storage": "128GB", "RAM": "6GB"}',
'<h2>Complete Review</h2><p>Great budget smartphone with excellent battery life...</p>',
'<h2>పూర్తి రివ్యూ</h2><p>అద్భుతమైన బ్యాటరీ జీవితంతో గొప్ప బడ్జెట్ స్మార్ట్‌ఫోన్...</p>', TRUE);

-- Insert sample blog posts
INSERT INTO blog_posts (title, title_te, slug, excerpt, excerpt_te, content, content_te, image, author, author_te, category, category_te, tags, published, featured, read_time) VALUES
('Top 10 Smartphones to Buy in 2024', '2024లో కొనుగోలు చేయవలసిన టాప్ 10 స్మార్ట్‌ఫోన్లు', 'top-10-smartphones-2024', 'We have reviewed the best smartphones that hit the market this year', 'ఈ సంవత్సరం మార్కెట్‌లో వచ్చిన అత్యుత్తమ స్మార్ట్‌ఫోన్లను మేము పరిశీలించాము', '<h2>Best Smartphones of 2024</h2><p>Here are the top smartphones...</p>', '<h2>2024 యొక్క ఉత్తమ స్మార్ట్‌ఫోన్లు</h2><p>ఇక్కడ టాప్ స్మార్ట్‌ఫోన్లు ఉన్నాయి...</p>', '/placeholder.svg?height=300&width=500', 'Ravi Kumar', 'రవి కుమార్', 'Technology', 'టెక్నాలజీ', ARRAY['smartphones', 'reviews', '2024'], TRUE, TRUE, 5),

('Things to Consider When Buying Home Appliances', 'గృహోపకరణలు కొనేటప్పుడు దృష్టిలో ఉంచవలసిన విషయాలు', 'buying-home-appliances-guide', 'Important tips to help you choose the right appliances for your home', 'మీ ఇంటికి సరైన ఉపకరణలను ఎంచుకోవడంలో మీకు సహాయపడే కొన్ని ముఖ్యమైన చిట్కాలు', '<h2>Home Appliance Buying Guide</h2><p>When buying home appliances...</p>', '<h2>గృహోపకరణల కొనుగోలు గైడ్</h2><p>గృహోపకరణలు కొనేటప్పుడు...</p>', '/placeholder.svg?height=300&width=500', 'Sudha Reddy', 'సుధా రెడ్డి', 'Home & Living', 'ఇల్లు & జీవనం', ARRAY['home appliances', 'buying guide', 'tips'], TRUE, FALSE, 7);
