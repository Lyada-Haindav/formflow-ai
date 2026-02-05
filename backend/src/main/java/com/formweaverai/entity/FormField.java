package com.formweaverai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "form_fields")
public class FormField {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "step_id", nullable = false)
    private FormStep step;

    @Column(nullable = false)
    private String label;

    @Column(name = "field_type", nullable = false)
    private String fieldType;

    private Boolean required = false;

    private String placeholder;

    private String options;

    @Column(name = "field_order", nullable = false)
    private Integer fieldOrder;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FormStep getStep() { return step; }
    public void setStep(FormStep step) { this.step = step; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getFieldType() { return fieldType; }
    public void setFieldType(String fieldType) { this.fieldType = fieldType; }

    public Boolean getRequired() { return required; }
    public void setRequired(Boolean required) { this.required = required; }

    public String getPlaceholder() { return placeholder; }
    public void setPlaceholder(String placeholder) { this.placeholder = placeholder; }

    public String getOptions() { return options; }
    public void setOptions(String options) { this.options = options; }

    public Integer getFieldOrder() { return fieldOrder; }
    public void setFieldOrder(Integer fieldOrder) { this.fieldOrder = fieldOrder; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
