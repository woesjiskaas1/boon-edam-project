INSERT INTO skill (name, description)
SELECT 'Communicatie', 'Effectief mondeling en schriftelijk communiceren'
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'Communicatie');

INSERT INTO skill (name, description)
SELECT 'Personeelsbeleid', 'Kennis van personeelsbeleid en HR-processen'
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'Personeelsbeleid');

INSERT INTO skill (name, description)
SELECT 'JavaScript', 'Ontwikkelen met JavaScript'
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'JavaScript');

INSERT INTO skill (name, description)
SELECT 'React', 'Ontwikkelen van interfaces met React'
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'React');

INSERT INTO skill (name, description)
SELECT 'Planning', 'Projecten en werkzaamheden plannen'
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'Planning');

INSERT INTO skill (name, description)
SELECT 'SEO', 'Zoekmachineoptimalisatie'
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'SEO');

INSERT INTO skill (name, description)
SELECT 'Netwerkbeheer', 'Computernetwerken beheren en onderhouden'
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'Netwerkbeheer');

INSERT INTO skill (name, description)
SELECT 'Klantcontact', 'Klanten professioneel ondersteunen'
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'Klantcontact');

INSERT INTO skill (name, description)
SELECT 'Onderhandelen', 'Commercieel onderhandelen'
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'Onderhandelen');

INSERT INTO job_role (name, description)
SELECT 'HR Manager', 'Beheert personeelsbeleid en HR-processen'
WHERE NOT EXISTS (SELECT 1 FROM job_role WHERE name = 'HR Manager');

INSERT INTO job_role (name, description)
SELECT 'Software Developer', 'Ontwikkelt en onderhoudt software'
WHERE NOT EXISTS (SELECT 1 FROM job_role WHERE name = 'Software Developer');

INSERT INTO job_role (name, description)
SELECT 'Project Manager', 'Plant en leidt projecten'
WHERE NOT EXISTS (SELECT 1 FROM job_role WHERE name = 'Project Manager');

INSERT INTO job_role (name, description)
SELECT 'Marketing Specialist', 'Ontwikkelt marketingactiviteiten'
WHERE NOT EXISTS (SELECT 1 FROM job_role WHERE name = 'Marketing Specialist');

INSERT INTO job_role (name, description)
SELECT 'IT Support', 'Ondersteunt gebruikers en beheert IT'
WHERE NOT EXISTS (SELECT 1 FROM job_role WHERE name = 'IT Support');

INSERT INTO job_role (name, description)
SELECT 'Sales Manager', 'Leidt verkoopactiviteiten en klantrelaties'
WHERE NOT EXISTS (SELECT 1 FROM job_role WHERE name = 'Sales Manager');

INSERT INTO job_role_skill (job_role_id, skill_id)
SELECT r.job_role_id, s.skill_id
FROM job_role r JOIN skill s ON s.name IN ('Communicatie', 'Personeelsbeleid')
WHERE r.name = 'HR Manager'
AND NOT EXISTS (
    SELECT 1 FROM job_role_skill rs
    WHERE rs.job_role_id = r.job_role_id AND rs.skill_id = s.skill_id
);

INSERT INTO job_role_skill (job_role_id, skill_id)
SELECT r.job_role_id, s.skill_id
FROM job_role r JOIN skill s ON s.name IN ('JavaScript', 'React')
WHERE r.name = 'Software Developer'
AND NOT EXISTS (
    SELECT 1 FROM job_role_skill rs
    WHERE rs.job_role_id = r.job_role_id AND rs.skill_id = s.skill_id
);

INSERT INTO job_role_skill (job_role_id, skill_id)
SELECT r.job_role_id, s.skill_id
FROM job_role r JOIN skill s ON s.name IN ('Planning', 'Communicatie')
WHERE r.name = 'Project Manager'
AND NOT EXISTS (
    SELECT 1 FROM job_role_skill rs
    WHERE rs.job_role_id = r.job_role_id AND rs.skill_id = s.skill_id
);

INSERT INTO job_role_skill (job_role_id, skill_id)
SELECT r.job_role_id, s.skill_id
FROM job_role r JOIN skill s ON s.name IN ('Communicatie', 'SEO')
WHERE r.name = 'Marketing Specialist'
AND NOT EXISTS (
    SELECT 1 FROM job_role_skill rs
    WHERE rs.job_role_id = r.job_role_id AND rs.skill_id = s.skill_id
);

INSERT INTO job_role_skill (job_role_id, skill_id)
SELECT r.job_role_id, s.skill_id
FROM job_role r JOIN skill s ON s.name IN ('Netwerkbeheer', 'Klantcontact')
WHERE r.name = 'IT Support'
AND NOT EXISTS (
    SELECT 1 FROM job_role_skill rs
    WHERE rs.job_role_id = r.job_role_id AND rs.skill_id = s.skill_id
);

INSERT INTO job_role_skill (job_role_id, skill_id)
SELECT r.job_role_id, s.skill_id
FROM job_role r JOIN skill s ON s.name IN ('Klantcontact', 'Onderhandelen')
WHERE r.name = 'Sales Manager'
AND NOT EXISTS (
    SELECT 1 FROM job_role_skill rs
    WHERE rs.job_role_id = r.job_role_id AND rs.skill_id = s.skill_id
);
