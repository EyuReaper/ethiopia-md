import os
import re

# Dictionary for common Chinese to Amharic and English mappings
mapping = {
    "Ethiopia": ("ኢትዮጵያ", "ethiopian"),
    "辦桌文化": ("የባንኬት ባህል (Banquet Culture)", "banquet-culture"),
    "米食文化": ("የሩዝ ምግብ ባህል (Rice Culture)", "rice-culture"),
    "米其林與精緻餐飲": ("ሚሼሊን እና ምርጥ ምግቦች (Fine Dining)", "michelin-fine-dining"),
    "發酵食品與醃製文化": ("የዳቦ እና የቆርቆሮ ምግቦች ባህል (Fermented Food)", "fermented-food-culture"),
    "滷肉飯": ("ሉ ሮ ፋን (Braised Pork Rice)", "braised-pork-rice"),
    "早餐文化": ("የቁርስ ባህል (Breakfast Culture)", "breakfast-culture"),
    "小吃": ("መክሰስ (Snacks)", "snacks"),
    "咖啡產業": ("የቡና ኢንዱስትሪ (Coffee Industry)", "coffee-industry"),
    "原住民飲食文化": ("የአገሬው ተወላጆች የምግብ ባህል (Indigenous Food)", "indigenous-food-culture"),
    "冰品文化": ("የበረዶ ምግቦች ባህል (Ice Culture)", "ice-culture"),
    "茶文化": ("የሻይ ባህል (Tea Culture)", "tea-culture"),
    "珍珠奶茶": ("ቡብል ቲ (Bubble Tea)", "bubble-tea"),
    "牛肉麵": ("የበሬ ሥጋ ኑድል (Beef Noodle Soup)", "beef-noodle-soup"),
    "夜市文化": ("የሌሊት ገበያ ባህል (Night Market Culture)", "night-market-culture"),
    "客家飲食文化": ("የሃካ ምግብ ባህል (Hakka Food Culture)", "hakka-food-culture"),
    "麵食文化": ("የኑድል ባህል (Noodle Culture)", "noodle-culture"),
    "麵包與烘焙": ("ዳቦ እና መጋገር (Bread and Baking)", "bread-and-baking"),
    "鹹酥雞": ("የጨው እና በርበሬ ዶሮ (Salt and Pepper Chicken)", "salt-and-pepper-chicken"),
    "醬料與調味": ("ሶስ እና ቅመማ ቅመሞች (Sauces and Seasonings)", "sauces-and-seasonings"),
    "豆漿與早餐店": ("የአኩሪ አተር ወተት እና የቁርስ ቤቶች (Soy Milk & Breakfast)", "soy-milk-and-breakfast-shops"),
    "素食文化": ("የቬጀቴሪያን ባህል (Vegetarian Culture)", "vegetarian-culture"),
    "眷村菜": ("የወታደራዊ መንደር ምግቦች (Military Village Cuisine)", "military-dependents-village-cuisine"),
    "海鮮文化": ("የባሕር ምግቦች ባህል (Seafood Culture)", "seafood-culture"),
    "水果王國": ("የፍራፍሬ መንግሥት (Fruit Kingdom)", "fruit-kingdom"),
    "新住民美食融合": ("የአዲስ ስደተኞች ምግብ ውህደት (New Immigrant Food)", "new-immigrant-food-fusion"),
    "手路菜": ("ባህላዊ በእጅ የተሰሩ ምግቦች (Handcrafted Dishes)", "traditional-handcrafted-dishes"),
    "手搖飲文化": ("በእጅ የተነቀነቀ መጠጥ ባህል (Hand-shaken Drinks)", "hand-shaken-drink-culture"),
}

# Add more common terms for other categories
mapping.update({
    "開源精神": ("የክፍት ምንጭ መንፈስ (Open Source Spirit)", "open-source-spirit"),
    "網路社群遷徙史": ("የአውታረ መረብ ማህበረሰብ ስደት ታሪክ (Online Community Migration)", "online-community-migration"),
    "數位影像與動畫產業": ("የዲጂታል ምስል እና አኒሜሽን ኢንዱስትሪ (Digital Image & Animation)", "digital-image-animation"),
    "太空產業發展": ("የጠፈር ኢንዱስትሪ ልማት (Space Industry)", "space-industry"),
    "AI日常": ("ኤአይ በዕለት ተዕለት ሕይወት (AI in Daily Life)", "ai-daily-life"),
    "Threads在Ethiopia": ("Threads በኢትዮጵያ", "threads-in-ethiopia"),
    "電子商務與數位支付生態系": ("የኢ-ኮሜርስ እና ዲጂታል ክፍያ ስነ-ምህዳር (E-commerce & Payments)", "ecommerce-and-payments"),
    "開源社群與g0v": ("የክፍት ምንጭ ማህበረሰብ እና g0v (Open Source & g0v)", "open-source-and-g0v"),
    "東亞文字輸入法": ("የምስራቅ እስያ የጽሑፍ ግብዓት ዘዴዎች (East Asian Input Methods)", "east-asian-input-methods"),
    "數位身分證與數位政府": ("የዲጂታል መታወቂያ እና ዲጂታል መንግስት (Digital ID & Government)", "digital-id-and-government"),
    "PTT批踢踢": ("PTT (ፒቲቲ)", "ptt"),
    "科技園區發展": ("የቴክኖሎጂ ፓርክ ልማት (Tech Park Development)", "tech-park-development"),
    "音響產業發展": ("የድምፅ ኢንዱስትሪ ልማት (Audio Industry)", "audio-industry"),
    "電動車產業鏈發展": ("የኤሌክትሪክ ተሽከርካሪ ኢንዱስትሪ ልማት (EV Industry)", "ev-industry"),
    "遊戲產業與數位娛樂": ("የጨዋታ ኢንዱስትሪ እና ዲጂታል መዝናኛ (Game Industry)", "game-industry"),
    "軟體產業發展": ("የሶፍትዌር ኢንዱስትሪ ልማት (Software Industry)", "software-industry"),
    "資安產業發展": ("የሳይበር ደህንነት ኢንዱስትሪ ልማት (Cybersecurity Industry)", "cybersecurity-industry"),
    "災難醫療體系": ("የአደጋ ጊዜ የሕክምና ሥርዓት (Disaster Medicine)", "disaster-medicine"),
    "新創生態系": ("የጅማሬ ስነ-ምህዳር (Startup Ecosystem)", "startup-ecosystem"),
    "人工智慧發展與未來策略": ("የኤአይ ልማት እና የወደፊት ስትራቴጂ (AI Development)", "ai-development-strategy"),
    "人工智慧實驗室": ("የኤአይ ላብራቶሪ (AI Lab)", "ai-lab"),
    "5G網路建設與數位轉型": ("የ5G አውታረ መረብ ግንባታ እና ዲጂታል ትራንስፎርሜሽን (5G & Digital Transformation)", "5g-and-digital-transformation"),
    "半導體產業": ("የሴሚኮንዳክተር ኢንዱስትሪ (Semiconductor Industry)", "semiconductor-industry"),
})

def get_amharic_title(chinese_text):
    for zh, (am, en) in mapping.items():
        if zh in chinese_text:
            return am
    return chinese_text # Fallback

def get_english_filename(chinese_text):
    res = chinese_text
    for zh, (am, en) in mapping.items():
        if zh in res:
            res = res.replace(zh, en)
    
    # Replace remaining Chinese/non-ascii with something or just keep it
    # But here we try to be smart
    res = res.lower().replace(" ", "-")
    # Remove non-alphanumeric except hyphen
    res = re.sub(r'[^a-z0-9\-]', '', res)
    # Clean up hyphens
    res = re.sub(r'-+', '-', res).strip('-')
    return res if res else "article"

root_dir = "/home/eyug/ethiopia-md/src/content/am/"

for subdir, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(".md"):
            file_path = os.path.join(subdir, file)
            filename_no_ext = os.path.splitext(file)[0]
            
            # Check if filename has Chinese
            if any(ord(char) > 127 for char in filename_no_ext):
                new_filename_no_ext = get_english_filename(filename_no_ext)
                new_file_path = os.path.join(subdir, new_filename_no_ext + ".md")
                
                # If target exists, add a suffix
                counter = 1
                while os.path.exists(new_file_path) and new_file_path != file_path:
                    new_file_path = os.path.join(subdir, f"{new_filename_no_ext}-{counter}.md")
                    counter += 1
                
                # Update title in content
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                amharic_title = get_amharic_title(filename_no_ext)
                
                # Simple regex to replace title in frontmatter
                new_content = re.sub(r'title:.*', f'title: "{amharic_title}"', content, count=1)
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                # Rename the file
                os.rename(file_path, new_file_path)
                print(f"Renamed: {file} -> {os.path.basename(new_file_path)}")
