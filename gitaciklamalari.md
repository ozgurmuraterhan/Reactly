Commit Message
Commit mesaji olabildigince kisa ve öz sekilde yazilmalidir. Commit mesaji yazarken kendinize "NE YAPTIM?" sorusunu sormalisiniz, "NASIL YAPTIM?" sorusunu sormayiniz. Hicbir zaman commit mesaji NASIL sorusuna cevap vermemeli zaten koddan bakilip nasil yapildigi gorulebilinir. Cumleler herzaman "present tense" olmali fiiller ek almamis sekilde (added, updated, moved, adding, updating, moving, removing seklinde olamaz). Commit basligi 70 karakteri gecmemeli, okunabilirligini dusurur. detay verilecekse altta verilebilinir. Detayda "NEDEN?" sorusuna cevap verebilirisniz. Isteyen tiklar ve okur.

FEAT
feat: add search filter to user table

Yeni bir özellik eklendiginde kullanilir. Cümle bir fiille basmali, "add" ile baslamali ve devaminda ne eklendigi (ve nereye eklendigi) yazilmalidir.

REFACTOR
refactor: use fragment for user list query

Halihazirda varolan ve calisan kodun yine ayni isi yapacak fakat daha okunakli ve uzerine daha kolay gelistirme yapilacak hale getirilmesi durumunda kullanilir. Cümle bir fille baslamali, genelde "set, move, remove" gibi fillerle ve devaminda ne yapildigi ve nerde yapildigi yazmalidir.

FIX
fix: user search filter case sensitivity

Uygulamanin, calismayan veya hataya sebep olan kisimlarin duzeltildigi durumda kullanilir. Cumle fillsiz baslar cunku burdaki fill herzaman fix olacaktir ve 2 defa fix yazmaya gerek yok. fix: fix user search filter case sensitivity seklinde 2 kere fix yazmaya gerek yok. Devaminda ne yapildigi ve nerde yapildigi yazmalidir.

STYLE
style: set task card view

Arayüzde sadece görüntüsel bir degisim yapilacaksa kullanilir. Cümle fiille baslar, genelde set fiili ile, devaminda ne yapildigi ve nerde yapildigi yazmalidir.

TEST
test: add user task list filter test

Test kodlarinda hayilan herhangi bir degisiklikte veya yeni test yazildiginda (yani test ile ilgili bir kodsa) kullanilir. Cumle feat, refactor, fix te ki gibi olabilir.

CHORE
chore: upgrade webpack to 4.1.1

Production code da bir degisiklik yapilmamis durumlarda kullanilir. Cümle fiille baslar devaminda ne yapildigi yazilir.

Branch Name
branch adi commit mesaji benzeri yazilabilinir. Tabi bir branch te bir cok commit olabileceginden daha genel olarak yapilan isin ne oldugu yazilmali.

chore/add-commit-message-guide

Pull Request
Pull request commit mesaji benzeri yazilabilinir.

chore: add commit message guide

Eger henuz pull request review/merge icin hazir degilse basina [WIP] ekliyoruz

[WIP]chore: add commit message guide
