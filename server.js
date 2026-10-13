const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let users = [
    { id: '1', badgeNumber: '1001', fullName: 'علي حسين', nationality: 'عراقي / Iraqi', role: 'عامل مزرعة / Site Worker', currentLocation: 'مزرعة 1', allergies: 'سليم / Healthy' }
];

// توليد قائمة المزارع من 1 إلى 60 بالتسلسل الكامل بدون قفزات + المفقس 1 والمفقس 2 فقط
let locations = [];
for (let i = 1; i <= 60; i++) {
    locations.push(`مزرعة ${i}`);
}
locations.push('المفقس 1', 'المفقس 2');

let alerts = [];

app.get('/api/users', (req, res) => {
    res.json({ users });
});

app.post('/api/users', (req, res) => {
    const newUser = { id: Date.now().toString(), ...req.body };
    users.push(newUser);
    res.json({ message: 'تم الحفظ بنجاح', user: newUser });
});

app.put('/api/users/update-location', (req, res) => {
    const { badgeNumber, currentLocation } = req.body;
    const user = users.find(u => String(u.badgeNumber) === String(badgeNumber));
    if (user) {
        user.currentLocation = currentLocation;
        res.json({ message: 'تم تحديث الموقع بنجاح' });
    } else {
        res.status(404).json({ error: 'الموظف غير موجود' });
    }
});

app.delete('/api/users/:id', (req, res) => {
    users = users.filter(u => u.id !== req.params.id);
    res.json({ message: 'تم الحذف' });
});

app.get('/api/locations', (req, res) => {
    res.json({ locations });
});

app.post('/api/locations', (req, res) => {
    const { newLocation } = req.body;
    if (newLocation && !locations.includes(newLocation)) {
        locations.push(newLocation);
    }
    res.json({ message: 'تمت إضافة الموقع بنجاح', locations });
});

app.get('/api/alerts', (req, res) => {
    res.json({ alerts });
});

app.post('/api/alerts', (req, res) => {
    const { badgeNumber, category, message, recipient } = req.body;
    const sender = users.find(u => String(u.badgeNumber) === String(badgeNumber));
    const newAlert = {
        id: Date.now().toString(),
        badgeNumber,
        senderName: sender ? sender.fullName : (badgeNumber === '0000' ? 'غرفة الطبابة' : 'غير مسجل'),
        location: sender ? sender.currentLocation : 'غير محدد',
        category,
        message,
        recipient,
        timestamp: new Date().toLocaleTimeString('ar-IQ')
    };
    alerts.push(newAlert);
    res.json({ message: 'تم إرسال التنبيه', alert: newAlert });
});

app.delete('/api/alerts/clear', (req, res) => {
    alerts = [];
    res.json({ message: 'تم تفريغ المحادثات بنجاح' });
});
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT}`);
});