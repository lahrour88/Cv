from flask import Flask, render_template, jsonify

app = Flask(__name__)

PROFILE = {
    "name": "Lahrour Abdeladime",
    "role": "Développeur Web & Passionné de Cybersécurité",
    "location": "Dr Lakbabra Tnaja, Mogran, Kenitra",
    "phone": "0616460988",
    "email": "abdelaadime2@gmail.com",
    "site": "https://lahrour.vercel.app",
    "bio": (
        "Lycéen en Sciences Physiques, autoformé en développement web et en "
        "cybersécurité depuis 2024. Construit des projets concrets en Flask "
        "et explore l'éthique du hacking pour comprendre comment sécuriser "
        "les systèmes plutôt que les attaquer."
    ),
}

SKILLS = [
    {
        "group": "Programmation",
        "tags": ["Python", "C", "Arduino Uno"],
    },
    {
        "group": "Développement Web",
        "tags": ["Flask", "HTML/CSS", "API", "Supabase"],
    },
    {
        "group": "Sécurité",
        "tags": ["Kali Linux", "Administration Systèmes"],
    },
]

LANGUAGES = [
    {"name": "Arabe", "level": "Langue maternelle", "value": 100},
    {"name": "Français", "level": "Niveau intermédiaire", "value": 60},
    {"name": "Anglais", "level": "Niveau débutant (A1)", "value": 25},
]

EDUCATION = [
    {
        "period": "2025 — 2026",
        "title": "Baccalauréat en Sciences Physiques",
        "detail": "",
    },
]

EXPERIENCE = [
    {
        "title": "Projet Web Scolaire",
        "detail": "Développement d'une plateforme (abou-talib.vercel.app) via Python-Flask.",
        "tag": "projet",
    },
    {
        "title": "Innovation Technique",
        "detail": (
            "Expérience en atelier de mécanique (soudore ) 3 mois ."
        ),
        "tag": "recherche",
    },
]

INTERESTS = [
    {"label": "Tech", "detail": "Éthique du hacking, innovation technologique."},
    {"label": "Lecture", "detail": "Romans de Fantasy et Suspense."},
    {"label": "Gaming", "detail": "Analyse du marché des comptes digitaux."},
]


@app.route("/")
def index():
    return render_template("index.html", profile=PROFILE)


@app.route("/api/profile")
def api_profile():
    return jsonify(PROFILE)


@app.route("/api/skills")
def api_skills():
    return jsonify(SKILLS)


@app.route("/api/languages")
def api_languages():
    return jsonify(LANGUAGES)


@app.route("/api/education")
def api_education():
    return jsonify(EDUCATION)


@app.route("/api/experience")
def api_experience():
    return jsonify(EXPERIENCE)


@app.route("/api/interests")
def api_interests():
    return jsonify(INTERESTS)


if __name__ == "__main__":
    app.run(port=5000 , host= '0.0.0.0' ,debug=True)
