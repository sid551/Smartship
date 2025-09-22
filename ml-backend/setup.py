from setuptools import setup, find_packages

setup(
    name="smartship-ml-api",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "Flask==2.2.2",
        "Flask-CORS==3.0.10",
        "Werkzeug==2.2.2",
        "numpy==1.24.3",
        "scikit-learn==1.3.0",
        "gunicorn==20.1.0"
    ],
    python_requires=">=3.9,<3.10"
)